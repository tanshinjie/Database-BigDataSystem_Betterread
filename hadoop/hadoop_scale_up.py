import sys
import boto3
import pprint as pp
import os
import time
from botocore.exceptions import ClientError
import subprocess
import json
import copy
from util import *
from script_generator import *
from datetime import datetime

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
    config = load_config('./settings/hadoop_config.json')

    session = boto3.session.Session(
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        aws_session_token=aws_session_token,
        region_name=config['region_name'],
    )
   
    ec2 = session.client("ec2")
    ec2_resource = session.resource("ec2")

    namenode_public_ip = config["namenode_public_ip"]
    key_file = "./settings/{}.pem".format(config["key_name"])

    cmds = []
    #################################
    ## Step 1: Creating instances ###
    #################################
    instances = create_new_ec2_instance(ec2, ec2_resource, config, mode="scale")
    print("Waiting for EC2 to spin up new instances...")
    time.sleep(120)

    priv_ips = []
    for i in instances:
        priv_ips.append(i.private_ip_address)

    public_ips = []
    ctr = 0
    while len(public_ips) != len(priv_ips) and ctr < 20:
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
    print("priv_ips", priv_ips)
    print("namenode_public_ip", namenode_public_ip)

    node_offset = config["node_offset"]
    hosts_name = ""
    for i in range(len(priv_ips)):
        hosts_name += "d{},".format(node_offset + i)
    hosts_name = hosts_name.replace("d0", "n1").split(",")[: len(priv_ips)]

    print("hosts_name", hosts_name)

    new_node_offset = node_offset + len(priv_ips)
    print("node_offset", node_offset)
    print("new_node_offset", new_node_offset)

    all_public_ips = config["public_ips"] + public_ips
    all_priv_ips = config["private_ips"] + priv_ips
    all_hosts_name = config["hosts_name"] + hosts_name

    ###########################################
    ### Step 3: Generating Scaling Scripts ####
    ###########################################
    disable_strict_host(public_ips)
    generate_hosts(all_priv_ips, all_hosts_name)
    generate_distribute_hadoop(priv_ips)
    generate_disable_strict_host_ssh(hosts_name)
    generate_append_workers(hosts_name)

    ##############################################
    ### Step 4: Copy resources & Configure SSH ###
    ##############################################
    """ Step 4: Copy resources over & Configure SSH """
    cmd = "scp -i {} -r ./tmp ./scripts ubuntu@{}:~/".format(
        key_file, namenode_public_ip
    )
    cmds.append(cmd)
    cmd = "ssh -i {} ubuntu@{} 'sudo mv ~/tmp/hosts /etc/hosts'".format(
        key_file, namenode_public_ip
    )
    cmds.append(cmd)
    for i in public_ips:
        cmd1 = "scp -i {} -r ./tmp ./scripts ubuntu@{}:~/".format(key_file, i)
        cmd2 = "ssh -i {} ubuntu@{} 'bash ~/scripts/create_hadoop_user.sh'".format(
            key_file, i
        )
        cmds.append(cmd1)
        cmds.append(cmd2)

    for i in range(0, len(public_ips)):
        cmd = 'ssh ubuntu@{nn_ip} -i {key} "sudo cat /home/hadoop/.ssh/id_rsa.pub" | ssh ubuntu@{dn_ip} -i {key} "sudo cat - | sudo tee -a /home/hadoop/.ssh/authorized_keys"'.format(
            key=key_file, nn_ip=namenode_public_ip, dn_ip=public_ips[i]
        )
        cmds.append(cmd)

    ##############################################
    ### Step 5: Append new workers on namende ###
    ##############################################
    cmd = "ssh -i {} ubuntu@{} 'bash ~/scripts/append_workers.sh'".format(
        key_file, namenode_public_ip
    )
    cmds.append(cmd)

    #################################################
    ### Step 6: Distribute hadoop to new datanode ###
    #################################################
    cmd = "ssh -i {} ubuntu@{} 'sudo su -c \"bash /home/ubuntu/scripts/disable_strict_host_ssh.sh\" hadoop'".format(
        key_file, namenode_public_ip
    )
    cmds.append(cmd)
    cmd = "ssh -i {} ubuntu@{} 'bash ~/scripts/distribute_hadoop.sh'".format(
        key_file, namenode_public_ip
    )
    cmds.append(cmd)

    ##############################
    ### Step 7: Setup datanode ###
    ##############################
    for i in public_ips:
        cmd = (
            "ssh -i {} ubuntu@{} 'bash ~/scripts/setup_hadoop_datanode.sh'".format(
                key_file, i
            )
        )
        cmds.append(cmd)

    ################################
    ### Step 8: Restart namenode ###
    ################################
    cmd = "ssh -i {} ubuntu@{} 'bash ~/scripts/restart_namenode.sh'".format(
        key_file, namenode_public_ip
    )
    cmds.append(cmd)

    for c in cmds:
        print("================================================================")
        print("Executing: ", c)
        process = subprocess.run(c, shell=True)
        # print(process.stdout)

    ######################################
    ## Final Step: Save system details ###
    ######################################
    new_config = copy.deepcopy(config)
    new_config["last_changed"] = str(datetime.now())
    new_config["namenode_public_ip"] = namenode_public_ip
    new_config["public_ips"] = all_public_ips
    new_config["private_ips"] = all_priv_ips
    new_config["node_offset"] = new_node_offset
    new_config["hosts_name"] = all_hosts_name
    host_ip_map = {}
    for i in range(len(priv_ips)):
        host_ip_map[hosts_name[i]] = priv_ips[i]
    new_config["host_ip_map"].update(host_ip_map)

    with open("./settings/hadoop_config.json", "w") as f:
        f.write(json.dumps(new_config))
