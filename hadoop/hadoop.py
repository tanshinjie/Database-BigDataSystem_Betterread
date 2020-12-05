import subprocess
from util import *
import sys

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in ["start", "stop"]:
        print("Usage: python3 hadoop.py [start|stop]")
    else:
        config = load_config("./settings/post_config.json")
        key_file = "./settings/{}.pem".format(config["key_name"])
        namenode_public_ip = config["namenode_public_ip"]
        cmd = ""
        if sys.argv[1] == "start":
            cmd = (
                "ssh -i {} ubuntu@{} ".format(key_file, namenode_public_ip)
                + "\"sudo su -c '/opt/hadoop-3.3.0/sbin/start-dfs.sh && /opt/hadoop-3.3.0/sbin/start-yarn.sh' hadoop\""
            )
        elif sys.argv[1] == "stop":
            cmd = (
                "ssh -i {} ubuntu@{} ".format(key_file, namenode_public_ip)
                + "\"sudo su -c '/opt/hadoop-3.3.0/sbin/stop-dfs.sh && /opt/hadoop-3.3.0/sbin/stop-yarn.sh' hadoop\""
            )
        subprocess.run(cmd, shell=True)
