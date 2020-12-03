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

REGION_NAME = "us-east-1"

aws_access_key_id = "ASIAVMPMSHONN7AB6QJX"
aws_secret_access_key = "YpTA/EqSRR7c3feIX/vv8fmjXIuEEZSBwkWHWBxq"
aws_session_token = "FwoGZXIvYXdzEEgaDJrRc+tSk0CkWV9J3CLNAV9Kp7fVDfyPVhlA/oTFJH0namIwgGIc4awwXszXGjz6GGJeN65Gly5tY3V8BAfo5ghryJ+vbrOr/P7ufgrm7wBUkPdJOkiQESsQT8kma50LocsqSrMMjWTN9okird6Lpx3NeTybzFxGfftpRR3SRd6mP/DTjDpaLX4s0YI2j+CruniC+5ygD7IadY7sWEqoa+L9RSNAD6fx5vmiHgCbh862/tuYHy5XdpAlUR4rBitULmzA4UoyOWZ9ieRBtwWbRDg6KTHnAQ48Z1b8WrEo/vaj/gUyLbU7CYjCfX8YcJcrRBbncF75VlA54KZXtNF55kz78mgbc6ZlZUrW3BANVaX2jQ=="


if __name__ == "__main__":
    # access_key_id = input("Access Key ID: ")
    # aws_secret_access_key = input("AWS Secret Access: ")
    # aws_session_token = input("AWS Session Token: ")

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
        key_file = "./settings/{}.pem".format(config["key_name"])
        cmds = []

        ##################################
        ### Step 1: Creating instances ###
        ##################################
        instances = create_new_ec2_instance(ec2, ec2_resource, mode="a")
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
        namenode_ip_address = public_ips[0]
        print("namenode_ip_address", namenode_ip_address)

        node_offset = config["node_offset"]
        hosts_name = ""
        for i in range(len(priv_ips)):
            hosts_name += "d{},".format(node_offset + i)
        hosts_name = hosts_name.replace("d0", "n1").split(",")[: len(priv_ips)]
        print("hosts_name", hosts_name)

        new_node_offset = node_offset + len(priv_ips)
        print("new_node_offset", new_node_offset)

        ##################################
        ### Step 3: Generating Scripts ###
        ##################################
        # disable_strict_host(public_ips)
        generate_hosts(priv_ips, hosts_name)
        generate_distribute_hadoop(priv_ips[1:])
        generate_disable_strict_host_ssh(priv_ips, hosts_name)
        generate_hadoop_config(hosts_name[1:])

        ##############################################
        ### Step 4: Copy resources & Configure SSH ###
        ##############################################
        """ Step 4: Copy resources over & Configure SSH """
        for i in public_ips:
            cmd1 = "scp -i {} -r ./tmp ./scripts ubuntu@{}:~/".format(key_file, i)
            cmd2 = "ssh -i {} ubuntu@{} 'bash ~/scripts/create_hadoop_user.sh'".format(
                key_file, i
            )
            cmds.append(cmd1)
            cmds.append(cmd2)

        cmd = "ssh -i {} ubuntu@{} 'bash ~/scripts/setup_ssh.sh'".format(
            key_file, namenode_ip_address
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
            key_file, namenode_ip_address
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
            key_file, namenode_ip_address
        )
        cmds.append(cmd)

        for c in cmds:
            print("================================================================")
            print("Executing: ", c)
            process = subprocess.run(c, shell=True)
            # print(process.stdout)

        ###################################
        ### Step 8: Save system details ###
        ###################################
        new_config = copy.deepcopy(config)
        new_config["namenode_public_ip"] = namenode_ip_address
        new_config["public_ips"] = public_ips
        new_config["private_ips"] = priv_ips
        new_config["node_offset"] = new_node_offset
        new_config["hosts_name"] = hosts_name
        host_ip_map = {}
        for i in range(len(priv_ips)):
            host_ip_map[hosts_name[i]] = priv_ips[i]
        new_config["host_ip_map"] = host_ip_map

        with open("./settings/post_config.json", "w") as f:
            f.write(json.dumps(new_config))

    except Exception as error:
        print(error)
