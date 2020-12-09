import sys
import boto3
import pprint as pp
import paramiko
import time
from botocore.exceptions import ClientError
import subprocess
from util import *
from script_generator import *
import copy
from datetime import datetime
import json

start_time = time.time()
with open('aws_token.txt','r') as f:
    tokens = []
    for i in f.readlines():
        print(r'{}'.format(i))
        if i[0:17] == 'aws_access_key_id':
            tokens.append(i[18:-1].strip())
        elif i[0:21] == 'aws_secret_access_key':
            tokens.append(i[22:-1].strip())
        elif i[0:17] == 'aws_session_token':
            tokens.append(i[18:].strip())
    print(tokens)

aws_access_key_id = tokens[0]
aws_secret_access_key = tokens[1]
aws_session_token = tokens[2]

if __name__ == "__main__":
    config = load_config("./settings/config.json")
    session = boto3.session.Session(
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        aws_session_token=aws_session_token,
        region_name=config['region_name'],
    )


    # ############# DEBUG ###################
    # config = load_config("./settings/hadoop_config.json")
    # namenode_public_ip = config['namenode_public_ip']
    # public_ips = config['public_ips']
    # private_ips = config['private_ips']
    # #######################################

    
    ec2 = session.client("ec2")
    ec2_resource = session.resource("ec2")
    
    key_file = "./settings/{}.pem".format(config["key_name"])
    cmds = []

    ##################################
    ### Step 1: Creating instances ###
    ##################################
    instances = create_new_ec2_instance(ec2, ec2_resource, config, mode="a")
    print("Waiting for EC2 to spin up new instances...")
    time.sleep(120)

    private_ips = []
    for i in instances:
        private_ips.append(i.private_ip_address)

    public_ips = []
    ctr = 0
    while len(public_ips) != len(private_ips) and ctr < 20:
        public_ips = []
        print("Loading...")
        for i in instances:
            i.reload()
            time.sleep(10)
        for i in instances:
            if i.public_ip_address == None:
                ctr += 1
            public_ips.append(i.public_ip_address)
    if ctr == 20:
        sys.exit("EC2 launches unsuccessful. Try again later. ")

    ##################################
    ### Step 2: Creating hostnames ###
    ##################################
    print("public_ips", public_ips)
    print("private_ips", private_ips)
    namenode_public_ip = public_ips[0]
    print("namenode_public_ip", namenode_public_ip)

    node_offset = config["node_offset"]
    hosts_name = ""
    for i in range(len(private_ips)):
        hosts_name += "d{},".format(node_offset + i)
    hosts_name = hosts_name.replace("d0", "n1").split(",")[: len(private_ips)]
    print("hosts_name", hosts_name)

    new_node_offset = node_offset + len(private_ips)
    print("node_offset", node_offset)
    print("new_node_offset", new_node_offset)

    ##################################
    ### Step 3: Generating Scripts ###
    ##################################
    disable_strict_host(public_ips)
    generate_hosts(private_ips, hosts_name)
    generate_distribute_hadoop(private_ips[1:])
    generate_disable_strict_host_ssh(hosts_name)
    generate_hadoop_config(hosts_name[1:])

    ##############################################
    ### Step 4: Copy resources & Configure SSH ###
    ##############################################
    for i in public_ips:
        cmd1 = "scp -i {} -r ./tmp ./scripts ubuntu@{}:~/".format(key_file, i)
        cmd2 = "ssh -i {} ubuntu@{} 'bash ~/scripts/create_hadoop_user.sh'".format(
            key_file, i
        )
        cmds.append(cmd1)
        cmds.append(cmd2)

    cmd = "ssh -i {} ubuntu@{} 'bash ~/scripts/setup_ssh.sh'".format(
        key_file, namenode_public_ip
    )
    cmds.append(cmd)

    for i in range(1, len(public_ips)):
        cmd = 'ssh ubuntu@{nn_ip} -i {key} "sudo cat /home/hadoop/.ssh/id_rsa.pub" | ssh ubuntu@{dn_ip} -i {key} "sudo cat - | sudo tee -a /home/hadoop/.ssh/authorized_keys"'.format(
            key=key_file, nn_ip=public_ips[0], dn_ip=public_ips[i]
        )
        cmds.append(cmd)

    ##############################
    ### Step 5: Setup namenode ###
    ##############################
    cmd = "ssh -i {} ubuntu@{} 'bash ~/scripts/setup_hadoop_namenode.sh'".format(
        key_file, namenode_public_ip
    )
    cmds.append(cmd)

    ##############################
    ### Step 6: Setup datanode ###
    ##############################
    for i in public_ips[1:]:
        cmd = (
            "ssh -i {} ubuntu@{} 'bash ~/scripts/setup_hadoop_datanode.sh'".format(
                key_file, i
            )
        )
        cmds.append(cmd)

    ##############################
    ### Step 7: Start namenode ###
    ##############################
    cmd = "ssh -i {} ubuntu@{} 'bash ~/scripts/start_namenode.sh'".format(
        key_file, namenode_public_ip
        )
    cmds.append(cmd)

    ##############################
    ### Step 8: Setup sqoop ####
    ##############################

    cmd = "ssh -i {} ubuntu@{} 'bash ~/scripts/setup_sqoop.sh'".format(
        key_file, namenode_public_ip
        )
    cmds.append(cmd)

    for c in cmds:
        print("================================================================")
        print("Executing: ", c)
        process = subprocess.run(c, shell=True)

    ##############################
    ### Step 9: Setup Spark #####
    ##############################
    ####################################################
    ### Step 9.1: Generate and distribute slave file ###
    ####################################################
    print("================================================================")
    print("Generating & Distributing slave file")
    with open('./tmp/slaves','w') as f:
        for ip in private_ips:
            if ip != private_ips[0]:
                f.write('{}\n'.format(ip))

    for ip in public_ips:
        cmd = 'scp -i {} ./tmp/slaves ./tmp/spark-env.sh ubuntu@{}:~/'.format(key_file,ip)
        subprocess.run(cmd,shell=True)

    ################################
    ### Step 9.2: Download Spark ###
    ################################
    print("================================================================")
    print("Downloading Spark...")
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

    

    ##############################
    ### Step 9.3: Run Spark ######
    ##############################
    print("================================================================")
    print("Running Spark...")    
    cmd1 = "scp -i {} -r ./analytics ubuntu@{}:~/".format(key_file, namenode_public_ip)
    cmd2 = """ssh -i {} ubuntu@{} \"sudo su -c 'sudo apt -y install python3-pip' hadoop\"""".format(key_file,namenode_public_ip)
    cmd3 = """ssh -i {} ubuntu@{} \"sudo su -c 'pip3 install pyspark' hadoop\"""".format(key_file,namenode_public_ip)
    cmd4 = 'ssh -i {} ubuntu@{} "sudo su -c \" /opt/spark-3.0.1-bin-hadoop3.2/sbin/start-all.sh\"" hadoop'.format(key_file,namenode_public_ip)
    cmds = [cmd1,cmd2,cmd3,cmd4]
    for cmd in cmds:
        process = subprocess.run(cmd,shell=True)
        print(process.stdout)

    #######################################
    ### Final Step: Save system details ###
    #######################################
    print("================================================================")
    print("Saving system details...")    
    new_config = copy.deepcopy(config)
    new_config["last_changed"] = str(datetime.now())
    new_config["namenode_public_ip"] = namenode_public_ip
    new_config["public_ips"] = public_ips
    new_config["private_ips"] = private_ips
    new_config["node_offset"] = new_node_offset
    new_config["hosts_name"] = hosts_name
    host_ip_map = {}
    for i in range(len(private_ips)):
        host_ip_map[hosts_name[i]] = private_ips[i]
    new_config["host_ip_map"] = host_ip_map

    with open("./settings/hadoop_config.json", "w") as f:
        f.write(json.dumps(new_config))

    print("--- {} seconds ---".format(time.time() - start_time))
