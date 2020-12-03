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

aws_access_key_id = "ASIAVMPMSHONDN7267N3"
aws_secret_access_key = "FH/eO0RIPz+WTx6iLUg/WUb9tUGsu8eS9ipCKFLx"
aws_session_token = "FwoGZXIvYXdzEDQaDCOYtrqIigAK5mAFMiLNAbvlkEoL42KTBITCn9h8/Ozxfkwm72ecivCC91+UGVcFoNCDJuG6k/cjoDc9KcY6cqu/NA/Lj+jQzih4R7MEIO3+RUrgZRlLci8EVbKveIxvJ4xZHPxu81E9siV5OsqAC9ED/r6g5T8lCQwdP+ZwBPwubEXVWfD9/wR4lIoxxq5NgxC096fzlecU/h9WeF2c2WVdLEhehO34iziOc41kBKHBm7V1FvXpoN87+HRYWvY7Quqw9E8MFOChuTfgdleseIz4yAW51Hx3lBSC1mcor8af/gUyLT5wP9tIENFeU8WZ88WEgY4/Xarp6bdhp0Xnizi/CUEg2zdnSilzmKHWeCHghQ=="

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

        config = load_config()

        namenode_public_ip = config["namenode_public_ip"]
        key_file = "./settings/{}.pem".format(config["key_name"])

        with open("./tmp/includes", "w+") as f:
            f.write("\n".join(list(config["includes"])))

        with open("./tmp/excludes", "w+") as f:
            f.write("\n".join(list(config["excludes"])))

        cmd1 = "scp -i {} ./tmp/excludes ./tmp/includes ubuntu@{}:~/".format(
            key_file, namenode_public_ip
        )
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
