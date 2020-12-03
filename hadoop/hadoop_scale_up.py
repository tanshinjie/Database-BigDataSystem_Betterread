import sys
import boto3
import pprint as pp
import os
import paramiko
import time
from botocore.exceptions import ClientError
import subprocess
import json
from util import *


REGION_NAME = "us-east-1"
SECURITY_GROUP_NAME = "betterread_analytics"
KEY_NAME = "betterread_analytics"
NUM_OF_INSTANCES = 2

aws_access_key_id = "ASIAVMPMSHONNJI3O756"
aws_secret_access_key = "3P+JRJUM9IcaY8fp/5DimSmCWv2sbavCNjPYSF49"
aws_session_token = "FwoGZXIvYXdzEC8aDHLxYKBeIoDVsgruJCLNAfMG4UpR8lAZJEAvrCcI198KOA/UG70HcScdxQLZm8xI9i60aCG8hTlxH7qMjZ6miOCX59CP1Mc3Uaa3rU/jHhdA3hVqgVVaowGCD0wvFh5dIH8Ik4mXCBDvTQYhMbonEmCoFP2ZiGXGtZejekaaiZWet03qRunpqasj8i2fiI0T6y7YLWLbE2lSk7pLshL9XXbllfoD9w+uvHShprEbP0Dfotf3TgQajO+jQrc56KbdG2eO9QK7+zlerv9BZbHzUDMH96z4y3Yd0PmaNSMozLKe/gUyLcsYR45BEgt/ReXyCcMhCMlrCp9dqq3/SQy4GLlag3oY5oPHDh8p7eP1aGqsWA=="


def execute_commands_in_instance_server(config, public_ips, priv_ips):
    # key_file = "./settings/{}.pem".format(config["key_name"])
    namenode_public_ip = config["namenode_public_ip"]

    key_file = "{}.pem".format("shinjie")
    # cmd = "scp -i {} ubuntu@{}:/etc/hosts ./".format(key_file, namenode_public_ip)
    # with open("hosts", "a") as f:
    #     for i in range(len(priv_ips)):
    #         f.write(
    #             "{}\td{}\n".format(priv_ips[i], config["number_of_datanode"] + i + 1)
    #         )
    # cmds = []
    for i in public_ips:
        cmd1 = "scp -i {} hosts createHadoopUser.sh setup_hadoop_datanode.sh ubuntu@{}:~/".format(
            key_file, i
        )
        subprocess.run(cmd1, shell=True)
    #     cmd2 = (
    #         "ssh ubuntu@{} -i {} ".format(i, key_file)
    #         + 'bash createHadoopUser.sh;"'
    #     )
    #     cmd3 = 'ssh ubuntu@{nn_ip} -i {key} "sudo cat /home/hadoop/.ssh/id_rsa.pub" | ssh ubuntu@{dn_ip} -i {key} "sudo cat - | sudo tee -a /home/hadoop/.ssh/authorized_keys"'.format(
    #         key=key_file, nn_ip=namenode_public_ip, dn_ip=i
    #     )
    #     cmds.append(cmd1)
    #     cmds.append(cmd2)
    #     cmds.append(cmd3)

    sub_script = ""
    for i in priv_ips:
        sub_script += """
sudo su -c 'echo {ip} >> /home/hadoop/includes' hadoop
sudo su -c 'ssh hadoop@{ip} "bash /home/ubuntu/setup_hadoop_datanode.sh"' hadoop
""".format(
            ip=i
        )

    script = """
echo Scaling up hadoop...

{}

#/opt/hadoop-3.3.0/bin/yarn rmadmin -refreshNodes
#/opt/hadoop-3.3.0/bin/hdfs dfsadmin -refreshNodes
#/opt/hadoop-3.3.0/bin/hdfs dfsadmin -report

echo Done.""".format(
        sub_script,
    )

    # with open("scale_up_hadoop.sh", "w") as f:
    #     f.write(script)

    # sub_script = ""
    # for i in priv_ips:
    #     sub_script += "sudo su -c 'scp /home/ubuntu/hadoop-3.3.0.tgz hadoop@{}:~/' hadoop\n".format(
    #         i
    #     )

    #     with open("distribute_hadoop.sh", "w") as f:
    #         script = """
    # echo Distributing hadoop to datanode...
    # {}
    # echo Done.
    # """.format(
    #             sub_script
    #         )
    #         f.write(script)

    with open("setup_new_ssh.sh", "w") as f:
        for i in priv_ips:
            cmd = """sudo su -c "ssh -o 'StrictHostKeyChecking no' {} 'echo 1 > /dev/null'" hadoop\n""".format(
                i
            )
            f.write(cmd)

    cmds = []
    cmd1 = "scp -i {} hosts scale_up_hadoop.sh setup_new_ssh.sh distribute_hadoop.sh ubuntu@{}:~/".format(
        key_file, namenode_public_ip
    )

    cmd2 = 'ssh ubuntu@{} -i {} "bash setup_new_ssh.sh; bash distribute_hadoop.sh ;bash scale_up_hadoop.sh"'.format(
        namenode_public_ip, key_file
    )
    cmds.append(cmd1)
    cmds.append(cmd2)

    for cmd in cmds:
        print("========================================")
        print(cmd)
        process = subprocess.run(cmd, shell=True)
        print(process.stdout)


if __name__ == "__main__":
    number_of_instances = sys.argv[1]

    session = boto3.session.Session(
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        aws_session_token=aws_session_token,
        region_name=REGION_NAME,
    )

    try:
        ec2 = session.client("ec2")
        ec2_resource = session.resource("ec2")

        config = load_config()

        # instances = create_new_ec2_instance(
        #     config["security_group_name"], config["key_name"], int(number_of_instances)
        # )

        # print("Waiting for EC2 to spin up new instances...")
        # time.sleep(90)

        # priv_ips = []

        # for i in instances:
        #     priv_ips.append(i.private_ip_address)

        # public_ips = []

        # while len(public_ips) != len(priv_ips):
        #     public_ips = []
        #     print("loading...")
        #     time.sleep(10)
        #     for i in instances:
        #         i.reload()
        #     for i in instances:
        #         public_ips.append(i.public_ip_address)

        # print(priv_ips)
        # print(public_ips)

        # for i in public_ips:
        #     process = subprocess.run(
        #         "ssh -o 'StrictHostKeyChecking no' {} 'echo 1 > /dev/null'".format(i),
        #         shell=True,
        #     )
        # process = subprocess.run(
        #     "ssh -o 'StrictHostKeyChecking no' {} 'echo 1 > /dev/null'".format(
        #         config["namenode_public_ip"]
        #     ),
        #     shell=True,
        # )

        # instances = create_new_ec2_instance(
        #     "launch-wizard-4", "myFirstKey", int(number_of_instances)
        # )

        priv_ips = ["172.31.92.44", "172.31.80.173"]
        public_ips = ["3.82.146.70", "52.90.77.154"]

        execute_commands_in_instance_server(config, public_ips, priv_ips)

    except Exception as error:
        print(error)
        pp.pprint(error)
