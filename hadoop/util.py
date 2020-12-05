import os
from botocore.exceptions import ClientError
import pprint as pp
import json
import subprocess


def load_config(config_path="./settings/config.json"):
    print("Loading config file...")
    config = json.load(open(config_path, "r"))
    return config


def generate_key_pairs(key_name, ec2):
    print("Generating a new key for EC2 instances")
    outfile = open("./settings/{}.pem".format(key_name), "w+")
    key_pair = ec2.create_key_pair(KeyName=key_name)
    KeyPairOut = str(key_pair["KeyMaterial"])
    outfile.write(KeyPairOut)
    print("Finish creating EC2 key pair")
    os.system("chmod 400 ./settings/{}.pem".format(key_name))


def create_security_group(security_group_name, ec2):
    response = ec2.describe_vpcs()
    vpc_id = response.get("Vpcs", [{}])[0].get("VpcId", "")

    try:
        response = ec2.create_security_group(
            GroupName=security_group_name,
            Description="Security group for BetterRead Analytics",
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
                    "FromPort": 5000,
                    "ToPort": 5000,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                },
                {
                    "IpProtocol": "tcp",
                    "FromPort": 22,
                    "ToPort": 22,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                },
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
        pp.pprint("Ingress successfully set...")

    except ClientError as e:
        pp.pprint(e)


def create_new_ec2_instance(
    ec2,
    ec2_resource,
    config,
    mode="p",
):
    security_group_name = config["security_group_name"]
    key_name = config["key_name"]
    number_of_instances = 1
    instance_type = "t2.micro"
    block_device_mappings = []
    if mode == "p":
        number_of_instances = config["number_of_production_server"]
    elif mode == "a":
        number_of_instances = config["number_of_analytics_server"]
        instance_type = config["analytics_server"]["instance_type"]
        block_device_mappings = config["analytics_server"]["block_device_mappings"]
    elif mode == "scale":
        number_of_instances = config["scale_factor"]
        instance_type = config["analytics_server"]["instance_type"]
        block_device_mappings = config["analytics_server"]["block_device_mappings"]

    print("security_group_name", security_group_name)
    print("key_name", key_name)
    print("number_of_instances", number_of_instances)
    print("instance_type", instance_type)
    print("block_device_mappings", block_device_mappings)

    try:
        response = ec2.describe_security_groups(GroupNames=[security_group_name])
        print("Security group: {} exists".format(security_group_name))
    except ClientError as e:
        print("Security group specified not found! Creating a new one...\n")
        create_security_group(security_group_name, ec2)
    print("New EC2 instances will be created under this security group.")

    key_not_exist = True

    keyPairs = ec2.describe_key_pairs()
    for key in keyPairs.get("KeyPairs"):
        if key.get("KeyName") == key_name:
            print("key-pair: {} exists.".format(key_name))
            key_not_exist = False
            break

    if key_not_exist:
        generate_key_pairs(key_name, ec2)

    try:
        new_instances = ec2_resource.create_instances(
            ImageId="ami-0885b1f6bd170450c",
            MinCount=1,
            MaxCount=number_of_instances,
            InstanceType=instance_type,
            SecurityGroups=[security_group_name],
            KeyName=key_name,
            BlockDeviceMappings=block_device_mappings,
        )

        for i in new_instances:
            print("New instance created (ID: " + i.id + ").")
        return new_instances

    except Exception as error:
        print(error)


def disable_strict_host(public_ips):
    cmds = []
    for i in public_ips:
        cmds.append(
            "ssh -o 'StrictHostKeyChecking no' {} 'echo 1 > /dev/null'".format(i)
        )
    for c in cmds:
        subprocess.run(c, shell=True)