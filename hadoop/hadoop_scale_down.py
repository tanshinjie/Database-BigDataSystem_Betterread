import boto3
import pprint as pp
import time
from botocore.exceptions import ClientError
import subprocess
import json
from teardown import *
from util import *

REGION_NAME = "us-east-1"
SECURITY_GROUP_NAME = "betterread_analytics"
KEY_NAME = "betterread_analytics"
NUM_OF_INSTANCES = 4

aws_access_key_id = "ASIAVMPMSHONAVBTTKNU"
aws_secret_access_key = "hoW0HgULCXiZVTsUvJOLuoRIz9NUk90jbEI3fJp+"
aws_session_token = "FwoGZXIvYXdzEGoaDL+HdmsZJ3MzyVsCJCLNAeaovTU9DoR7OiwkO5oqzo5QcDDysJ0cGD+IAr6mPftb4jOgl71tlGb0YnIgWDt7ZyGNTdvcNAAeUoU0KpXvR4ITyLe0M2UCnX4xcXTXJDtVjXl0AraHTT+8E3Dvo4SC/0SSBN2vxAR3KXLXeu9Mnr7CjKy88//cXfhvSHHc88pTDXARxyD9auUVbQTkHYs2uXObfuSgqa1fQKzTOwjG5oiLjBNKTeJdQ0mhjqDMBUmO3X/DSAGxZAcoozvVHC8nscYRLsDGnAZy82tlMOcou7Wr/gUyLTmAp6IrlHQEtI3F9MFSH3BAbkIDW39c4rlP24qywrxVCEjo9DpYXkcO2xc2AQ=="

if __name__ == "__main__":
    session = boto3.session.Session(
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        aws_session_token=aws_session_token,
        region_name=REGION_NAME,
    )

    try:
        ec2 = session.client("ec2")
        ec2_resource = session.resource("ec2")

        config = load_config("./settings/post_config.json")

        namenode_public_ip = config["namenode_public_ip"]
        key_file = "./settings/{}.pem".format(config["key_name"])

        with open("./tmp/includes", "w+") as f:
            f.write("\n".join(list(config["includes"])))

        with open("./tmp/excludes", "w+") as f:
            f.write("\n".join(list(config["excludes"])))

        print("Decomissioning: ", list(config["excludes"]))
        print("Comissioning: ", list(config["includes"]))

        cmd1 = "scp -i {} -r ./tmp ubuntu@{}:~/".format(key_file, namenode_public_ip)
        cmd2 = "ssh -i {} ubuntu@{} 'bash ~/scripts/refresh_hdfs.sh'".format(
            key_file, namenode_public_ip
        )
        cmds = [cmd1, cmd2]
        for c in cmds:
            subprocess.run(c, shell=True)

        print("Tearing down...")
        priv_ips_to_tear_down = []
        for i in config["excludes"]:
            priv_ips_to_tear_down.append(config["host_ip_map"][i])

        print(priv_ips_to_tear_down)
        time.sleep(10)
        # teardown("s", priv_ips=priv_ips_to_tear_down)
        print("Done.")

    except Exception as error:
        print(error)
        pp.pprint(error)
