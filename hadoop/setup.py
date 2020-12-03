import boto3
import pprint as pp
import os
import paramiko
import time
from botocore.exceptions import ClientError

REGION_NAME = "us-east-1"
SECURITY_GROUP_NAME = "betterread"
KEY_NAME = "ec2-keypair"
NUM_OF_INSTANCES = 3

aws_access_key_id = "ASIAVMPMSHONO7WXA4LP"
aws_secret_access_key = "JoePKBzMi0JNUSIc/EKNidJO73gC9/5W6dM0sMon"
aws_session_token = "FwoGZXIvYXdzEBIaDI1LtK9fUP5GaUjLWCLNAT2jCn4iQzIwW7cCGguGGHzeBuNZ3gUCteSM31mNFtWvLBUlaA6ss7BprlPGx+ONutaYpY+QHUjeOmn/lTDBv7yDcfjz2zpFSAhsn8/rvBhQSdjuK7HhZ5nOhoxc75DJLrYoIEtJfZqatJt8JoVNFTLJOIl5TM1uTCZ0PK3fxw07uRXz6Zn0fOqfK/cdMqF8uiKgt7nQSnXfgI7tCMvAJ9+2qRb6UhrG652ivqcSR+9KygwGfeTnWbE9QxJl0+wE1RWnUH0p9yjPD8hsvrko6+zf/QUyLQdTYQY1qvHl4y236zDDQxJhQ/nPQsWYu3i3RaK/ztw4Bf0b1T3vvM/gwa/MGQ=="


def generate_key_pairs(key_name):
    print("Generating a unique key for EC2 instances")
    os.system("rm {}.pem".format(key_name))
    outfile = open("{}.pem".format(key_name), "w+")
    key_pair = ec2.create_key_pair(KeyName=key_name)
    KeyPairOut = str(key_pair["KeyMaterial"])
    outfile.write(KeyPairOut)
    print("Finish creating EC2 key paris")
    os.system("chmod 400 {}.pem".format(key_name))


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
                    "FromPort": 80,
                    "ToPort": 80,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                },
                {
                    "IpProtocol": "tcp",
                    "FromPort": 22,  ## SSH
                    "ToPort": 22,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                },
                {
                    "IpProtocol": "tcp",
                    "FromPort": 27017,  ## MongoDB
                    "ToPort": 27017,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                },
                {
                    "IpProtocol": "tcp",
                    "FromPort": 3306,  ## mySQL
                    "ToPort": 3306,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
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
            break
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
    key = paramiko.RSAKey.from_private_key_file(key_name + ".pem")

    client = paramiko.SSHClient()

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    instance_ip = public_ip_address

    # cmd7 = "wget https://kindlemetadata.s3-us-west-2.amazonaws.com/kindle_reviews.csv"
    # cmd1 = "wget https://kindlemetadata.s3-us-west-2.amazonaws.com/setup_mysql_new.sh"
    # cmd2 = "chmod +x setup_mysql_new.sh"
    # cmd3 = "sh setup_mysql_new.sh"
    # cmd4 = "wget https://kindlemetadata.s3-us-west-2.amazonaws.com/setup_tables.sh"
    # cmd5 = "chmod +x setup_tables.sh"
    # cmd6 = "sh setup_tables.sh"
    # cmds = [cmd7, cmd1, cmd2, cmd3, cmd4, cmd5, cmd6]
    cmds = []

    try:

        client.connect(hostname=instance_ip, username="ubuntu", pkey=key)

        # Execute a command(cmd) after connecting/ssh to an instance
        for cmd in cmds:
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.channel.recv_exit_status())

        client.close()

    except Exception as e:
        print(e)


def execute_commands_in_instance_mongodb(public_ip_address, key_name):
    key = paramiko.RSAKey.from_private_key_file(key_name + ".pem")

    client = paramiko.SSHClient()

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    # Connect/ssh to an instance
    instance_ip = public_ip_address

    # cmd1 = "wget https://kindlemetadata.s3-us-west-2.amazonaws.com/setup_mongo.sh"
    # cmd2 = "chmod +x setup_mongo.sh"
    # cmd3 = "sh setup_mongo.sh"
    # cmds = [cmd1,cmd2,cmd3]

    cmds = []

    try:

        client.connect(hostname=instance_ip, username="ubuntu", pkey=key)

        # Execute a command(cmd) after connecting/ssh to an instance
        for cmd in cmds:
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.channel.recv_exit_status())

        client.close()

    except Exception as e:

        print(e)


def execute_commands_in_instance_server(
    public_ip_address, key_name, github_username, github_password
):
    key = paramiko.RSAKey.from_private_key_file(key_name + ".pem")

    client = paramiko.SSHClient()

    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    instance_ip = public_ip_address

    # cmd1 = "wget https://kindlemetadata.s3-us-west-2.amazonaws.com/pipinstalllibs.sh"
    # cmd2 = "chmod +x pipinstalllibs.sh"
    # cmd3 = "sh pipinstalllibs.sh"
    # cmd4 = "git clone https://github.com/yqyqyq123/50.043-project.git"
    # text = " ".join(iplist)
    # cmd5 = "echo " + text + "> ip.txt"
    # cmd6 = "echo " + text + "> /home/ubuntu/50.043-project/flaskapp/ip.txt"
    # cmd7 = "wget https://kindlemetadata.s3-us-west-2.amazonaws.com/flask_setup.sh"
    # cmd8 = "screen -d -m bash flask_setup.sh"

    # cmds = [cmd1, cmd2, cmd3, cmd4, cmd5, cmd6, cmd7, cmd8]
    cmd1 = "git clone https://{}:{}@github.com/tanshinjie/database_project.git".format(
        github_username, github_password
    )
    # cmd2 = "sh ~/database_project/setup.sh"
    cmds = [cmd1]

    try:
        client.connect(hostname=instance_ip, username="ubuntu", pkey=key)
        for cmd in cmds:
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.read().decode())
            print(stdout.channel.recv_exit_status())

        client.close()

    except Exception as e:
        print(e)


if __name__ == "__main__":

    # Testing specific instance
    # instance = ec2_resource.Instance("id")
    # print(instance[0].instance_id)
    ############################

    # security_group_name = input("Please enter the security group name:\n")
    # key_name = input("Please enter the key name:\n")
    # numofinstances = 3

    # access_key_id = input("Access Key ID: ")
    # aws_secret_access_key = input("AWS Secret Access: ")
    # aws_session_token = input("AWS Session Token: ")

    github_username = input("Github username? ")
    github_password = input("Github password? ")

    # session = boto3.session.Session(
    #     aws_access_key_id="ASIAVMPMSHONPDFA2UDP",
    #     aws_secret_access_key="SL9AUFi3h3GcZB8rBy1sCIyyBQTAAb5lYrlmAcR0",
    #     aws_session_token="FwoGZXIvYXdzEKr//////////wEaDBLAqY+K4wMh+67G+iLNAQHUmQPpMxf0eVpD8+J0x/aRg0QupkRYiiWb2HudZhndZfzopJXMqoDhXT8SdDCqDYi/BqBVYex4/dCrBblMAoAsPutRU1vx6fZpF9/4/GJCQGMp8OqckIeM51YHXar2/XxN/UQXIRwIBRsYaoqCtzr3h4Z+TPZnGj6oxY1fdaFjlVLkmD/u4s0AU2n7RnK4tBzNwuXdHPccccjrOorkr5K2keL9NITkyfTysH5WyZc+/kjvxcEDgyxDjPRq+zsiPhHGlGKcdrWrbuz4aHYo/OfI/QUyLRrjPs5jpRBfHIJyYEFAt2rt1na3kFo/Ik1IEk5K+g0HwaMuq6g45EK2lsMCAg==",
    #     region_name="us-east-1",
    # )
    session = boto3.session.Session(
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        aws_session_token=aws_session_token,
        region_name=REGION_NAME,
    )
    try:
        ec2 = session.client("ec2")
        ec2_resource = session.resource("ec2")

        # instance = ec2_resource.Instance("id")
        execute_commands_in_instance_server(
            "3.86.240.232", "shinjie", github_username, github_password
        )

        # instance = create_new_webserver_instance(SECURITY_GROUP_NAME, KEY_NAME, NUM_OF_INSTANCES)

        # print("Sleeping the program for 60 seconds to let the instance to be configured..")
        # time.sleep(90)

        # instance[0].reload()
        # execute_commands_in_instance_mysql(instance[0].public_ip_address, KEY_NAME)
        # print("sql setup done")

        # instance[1].reload()
        # execute_commands_in_instance_mongodb(instance[1].public_ip_address, KEY_NAME)
        # print("mongodb setup done")

        # instance[2].reload()
        # print(instance[2].public_ip_address)
        # iplist = []
        # iplist = [instance[0].public_ip_address, instance[1].public_ip_address]

        # execute_commands_in_instance_server(instance[2].public_ip_address, KEY_NAME, iplist)
        # print("server setup done, can view in:", instance[2].public_ip_address)
    except Exception as error:
        print(error)
