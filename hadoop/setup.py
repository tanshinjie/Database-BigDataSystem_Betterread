import subprocess
from hadoop_scale_down import KEY_NAME, NUM_OF_INSTANCES, REGION_NAME, SECURITY_GROUP_NAME
import boto3
import pprint as pp
import os
import paramiko
import time
from botocore.exceptions import ClientError
import json
import getpass

config = json.load(open('settings/config.json', "r"))
SECURITY_GROUP_NAME = config["security_group_name"]
KEY_NAME = config["key_name"]
NUM_OF_INSTANCES = config["number_of_production_server"]
REGION_NAME = config['region_name']

with open('aws_token.txt','r') as f:
    tokens = []
    for i in f.readlines():
        print(r'{}'.format(i))
        if i[0:17] == 'aws_access_key_id':
            tokens.append(i[18:-1])
        elif i[0:21] == 'aws_secret_access_key':
            tokens.append(i[22:-1])
        elif i[0:17] == 'aws_session_token':
            tokens.append(i[18:])
    print(tokens)

aws_access_key_id = tokens[0]
aws_secret_access_key = tokens[1]
aws_session_token = tokens[2]

session = boto3.session.Session(
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    aws_session_token=aws_session_token,
    region_name=REGION_NAME,)

ec2 = session.client("ec2")
ec2_resource = session.resource("ec2")



def generate_key_pairs(key_name):
    print("Generating a new key for EC2 instances")
    outfile = open("./settings/{}.pem".format(key_name), "w+")
    key_pair = ec2.create_key_pair(KeyName=key_name)
    KeyPairOut = str(key_pair["KeyMaterial"])
    outfile.write(KeyPairOut)
    print("Finish creating EC2 key pair")
    os.system("chmod 400 ./settings/{}.pem".format(key_name))


def create_security_group(security_group_name):
    response = ec2.describe_vpcs()
    vpc_id = response.get("Vpcs", [{}])[0].get("VpcId", "")

    try:
        response = ec2.create_security_group(
            GroupName=security_group_name,
            Description="Security group for BetterRead",
            VpcId=vpc_id,
        )
        security_group_id = response["GroupId"]
        pp.pprint(
            "Security Group Created {} in vpc {}.".format(security_group_id, vpc_id)
        )

        data = ec2.authorize_security_group_ingress(
            GroupId=security_group_id,
            IpPermissions=[
                {
                    "IpProtocol": "tcp",
                    "FromPort": 80, ## http
                    "ToPort": 80,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                },
                {
                    "IpProtocol": "tcp",
                    "FromPort": 22,  ## SSH
                    "ToPort": 22,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                },
                # {
                #     "IpProtocol": "tcp",
                #     "FromPort": 27017,  ## MongoDB
                #     "ToPort": 27017,
                #     "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                # },
                # {
                #     "IpProtocol": "tcp",
                #     "FromPort": 3306,  ## mySQL
                #     "ToPort": 3306,
                #     "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                # },
                {
                    "IpProtocol": "tcp",
                    "FromPort": 0,
                    "ToPort": 65535,
                    "UserIdGroupPairs": [
                        {
                            "Description": "betterread-analytics",
                            "GroupId": security_group_id,
                        },
                    ],
                },
            ],
        )
        pp.pprint("Ingress Successfully Set {}".format(data))

    except ClientError as e:
        pp.pprint(e)


def create_new_webserver_instance(security_group_name, key_name, numofinstances):
    try:
        response = ec2.describe_security_groups(GroupNames=[security_group_name])
        print("Security group: {} exists".format(security_group_name))
    except ClientError as e:
        print("Security group specified not found! Creating a new one...\n")
        create_security_group(security_group_name)

    key_not_exist = True

    keyPairs = ec2.describe_key_pairs()
    for key in keyPairs.get("KeyPairs"):
        if key.get("KeyName") == key_name:
            print("key-pair: {} exists.".format(key_name))
            ec2.delete_key_pair(KeyName=key_name)
            print("Deleting existing key-pair", key_name)
            os.remove("./settings/{}.pem".format(key_name))
            break
    print('calling generate keys')
    generate_key_pairs(key_name)

    try:
        new_instances = ec2_resource.create_instances(
            ImageId="ami-0885b1f6bd170450c",
            MinCount=1,
            MaxCount=numofinstances,
            InstanceType="t2.micro",
            SecurityGroups=[security_group_name],
            KeyName=key_name,
        )

        print("New instance created (ID: " + new_instances[0].id + ").")
        print("New instance created (ID: " + new_instances[1].id + ").")
        print("New instance created (ID: " + new_instances[2].id + ").")
        return new_instances

    except Exception as error:
        print(error)


def execute_commands_in_instance_mysql(public_ip_address, key_name):
    key = paramiko.RSAKey.from_private_key_file('settings/'+key_name + ".pem")

    client = paramiko.SSHClient()

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    instance_ip = public_ip_address

    cmd1 = 'wget --output-document=sqlscript.sh https://istd50043-database-project.s3.us-east-1.amazonaws.com/mysql_script/sqlscript.sh'
    cmd2 = 'sh sqlscript.sh'

    cmds = [cmd1, cmd2]

    try:

        client.connect(hostname=instance_ip, username="ubuntu", pkey=key)

        print("Setting up MySQL on @ ip:{}".format(public_ip_address))

        # Execute a command(cmd) after connecting/ssh to an instance
        for cmd in cmds:
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.read().decode())
            print(stdout.channel.recv_exit_status())

        client.close()

    except Exception as e:
        print(e)


def execute_commands_in_instance_mongodb(public_ip_address, key_name):
    key = paramiko.RSAKey.from_private_key_file('settings/'+key_name + ".pem")

    client = paramiko.SSHClient()

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    # Connect/ssh to an instance
    instance_ip = public_ip_address
       
    cmd1 = 'wget --output-document=mongo_script.sh https://istd50043-database-project.s3.us-east-1.amazonaws.com/mongo_script/mongo_script.sh'
    cmd2 = 'sh mongo_script.sh'
    cmd3 = 'sh mongo_script.sh'

    cmds = [cmd1,cmd2,cmd3]

    try:

        client.connect(hostname=instance_ip, username="ubuntu", pkey=key)

        print("Setting up MongoDB on @ ip:{}".format(public_ip_address))

        # Execute a command(cmd) after connecting/ssh to an instance
        for cmd in cmds:
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.read().decode())
            print(stdout.channel.recv_exit_status())

        client.close()

    except Exception as e:

        print(e)


def execute_commands_in_instance_server(
    public_ip_address, key_name, github_username, github_password
):
    key = paramiko.RSAKey.from_private_key_file('settings/'+key_name + ".pem")

    client = paramiko.SSHClient()

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    instance_ip = public_ip_address

    cmd1 = "git clone https://{}:{}@github.com/tanshinjie/database_project.git".format(
        github_username, github_password    #hohouyj,6be161cf885ca17ec448e4d98dbdef97b3bbd9f6
    )
    # cmd1 = 'sudo apt install subversion -y'
    # cmd2 = 'svn checkout https://github.com/tanshinjie/database_project/branches/ui_router_rework'
    cmd3 = "sh ~/database_project/setup.sh"
    cmds = [cmd1,cmd3]

    try:
        client.connect(hostname=instance_ip, username="ubuntu", pkey=key)

        print("Setting up webserver on @ ip:{}".format(public_ip_address))

        for cmd in cmds:
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.read().decode())
            print(stdout.channel.recv_exit_status())

        client.close()

    except Exception as e:
        print(e)

def transfer_ips_to_webserver_instance(public_ip_address, key_name, iplist):

    with open('settings/ip_list.json','+w') as f:
        f.write(json.dumps(iplist))
    
    cmd1 = "ssh -o 'StrictHostKeyChecking no' {} 'echo 1 > /dev/null'".format(public_ip_address)
    cmd2 = 'scp -i settings/{}.pem settings/ip_list.json ubuntu@{}:~/'.format(key_name,public_ip_address)

    cmds = [cmd1,cmd2]
    for c in cmds:
        subprocess.run(c,shell=True)

if __name__ == "__main__":

    github_username = input("Github username? ")
    github_password = getpass.getpass("Github password? ")

    try:

        instance = create_new_webserver_instance(SECURITY_GROUP_NAME, KEY_NAME, NUM_OF_INSTANCES)

        print("Sleeping the program for 60 seconds to let the instance to be configured..")
        time.sleep(90)
        
        #reload MySQL instance and run commands
        instance[0].reload()
        execute_commands_in_instance_mysql(instance[0].public_ip_address, KEY_NAME)
        print("MySQL setup done!")

        #reload mongodb instance and run commands
        instance[1].reload()
        execute_commands_in_instance_mongodb(instance[1].public_ip_address, KEY_NAME)
        print("mongodb setup done!")

        #reload webserver instance and run commands
        instance[2].reload()
        #print(instance[2].public_ip_address)
        #Collect databases ip and dump into settings/ip_list.json
        #then pass to webserver via scp
        iplist = {
            'mysql_ip' : instance[0].private_ip_address,
            'mongodb_ip' : instance[1].private_ip_address,
            'webserver_ip' : instance[2].private_ip_address
        }
        print('passing ips to webserver instance')
        transfer_ips_to_webserver_instance(instance[2].public_ip_address, KEY_NAME, iplist)

        execute_commands_in_instance_server(instance[2].public_ip_address, KEY_NAME,github_username, github_password)#, iplist)
        print("webserver setup done, can view in:", instance[2].public_ip_address)

    except Exception as error:
        print(error)
