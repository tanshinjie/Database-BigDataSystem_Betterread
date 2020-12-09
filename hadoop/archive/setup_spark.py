import sys
import boto3
import pprint as pp
import time
import subprocess
from util import *
from script_generator import *
import copy
from datetime import datetime
import json

if __name__ == "__main__":
    config = load_config("./settings/hadoop_config.json")
    key_file = "./settings/{}.pem".format(config["key_name"])

    key = paramiko.RSAKey.from_private_key_file(key_file)
    cmds = []

    public_ips = config['public_ips']
    namenode_public_ip = config['namenode_public_ip']
    private_ips = config['private_ips']
    print(private_ips)

    ##################################################
    ### Step 1: Generate and distribute slave file ###
    ##################################################
    with open('./tmp/slaves','w') as f:
        for ip in private_ips:
            if ip != private_ips[0]:
                f.write('{}\n'.format(ip))

    for i in public_ips:
        cmd = 'scp -i {} ./tmp/slaves ./tmp/spark-env.sh ubuntu@{}:~/'.format(key_file,i)
        subprocess.run(cmd,shell=True)

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ##############################
    ### Step 2: Download Spark ###
    ##############################

    for ip in public_ips:
        cmd1 = 'ssh -i {} ubuntu@{} "wget https://apachemirror.sg.wuchna.com/spark/spark-3.0.1/spark-3.0.1-bin-hadoop3.2.tgz"'.format(key_file,ip)
        cmd2 = 'ssh -i {} ubuntu@{} "tar zxf spark-3.0.1-bin-hadoop3.2.tgz"'.format(key_file,ip)
        cmd3 = 'ssh -i {} ubuntu@{} "cp spark-3.0.1-bin-hadoop3.2/conf/spark-env.sh.template spark-3.0.1-bin-hadoop3.2/conf/spark-env.sh"'.format(key_file,ip)
        cmd4 = 'ssh -i {} ubuntu@{} "cp spark-env.sh spark-3.0.1-bin-hadoop3.2/conf/"'.format(key_file,ip)
        cmd5 = 'ssh -i {} ubuntu@{} "cp slaves spark-3.0.1-bin-hadoop3.2/conf/"'.format(key_file,ip)
        cmd6 = 'ssh -i {} ubuntu@{} "sudo mv spark-3.0.1-bin-hadoop3.2 /opt/"'.format(key_file,ip)
        cmd7 = 'ssh -i {} ubuntu@{} "sudo chown -R hadoop:hadoop /opt/spark-3.0.1-bin-hadoop3.2"'.format(key_file,ip)

        cmds = [cmd1,cmd2,cmd3,cmd4,cmd5,cmd6,cmd7]

        for cmd in cmds:
            subprocess.run(cmd,shell=True)

    #############################
    ### Step 3: Run Spark ######
    #############################
    cmd = 'ssh -i {} ubuntu@{} "sudo su -c \" /opt/spark-3.0.1-bin-hadoop3.2/sbin/start-all.sh\"" hadoop'.format(key_file,namenode_public_ip)


    ##################################
    ### Step 3: Start Spark Job ######
    ###################################
    cmd = "export PYSPARK_PYTHON=python3 && python3 /home/ubuntu/analytics/pearson.py"
    subprocess.run(cmd,shell=True)