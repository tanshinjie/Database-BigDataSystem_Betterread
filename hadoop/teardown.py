import boto3
import pprint as pp
from botocore.exceptions import ClientError
from util import load_config


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
    print()

aws_access_key_id = tokens[0]
aws_secret_access_key = tokens[1]
aws_session_token = tokens[2]


def teardown(mode, **kwargs):
    try:
        if mode == "a":
            key_name = kwargs.get("key_name", None)
            instances = ec2_resource.instances.filter(
                Filters=[{"Name": "key-name", "Values": [key_name]}]
            )
            ids = [i.instance_id for i in instances]
            print(ids)
            response = ec2.terminate_instances(InstanceIds=ids)
            pp.pprint(response)
        elif mode == "s":
            priv_ips = kwargs.get("priv_ips", None)

            instances = ec2_resource.instances.filter(
                Filters=[{"Name": "private-ip-address", "Values": priv_ips}]
            )
            ids = [i.instance_id for i in instances]
            print(ids)
            response = ec2.terminate_instances(InstanceIds=ids)
            pp.pprint(response)
        else:
            print("Mode available: a - all, s - scale")

    except Exception as error:
        pp.pprint(error)


if __name__ == "__main__":
    config = load_config()
    session = boto3.session.Session(
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        aws_session_token=aws_session_token,
        region_name=config['region_name'],
    )

    ec2 = session.client("ec2")
    ec2_resource = session.resource("ec2")

    # specify key name 
    teardown("a", key_name=config['key_name'])
