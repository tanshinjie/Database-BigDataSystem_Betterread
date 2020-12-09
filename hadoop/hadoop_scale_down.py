import time
import subprocess
import json
from teardown import *
from util import *

if __name__ == "__main__":

    config = load_config("./settings/hadoop_config.json")

    namenode_public_ip = config["namenode_public_ip"]
    key_file = "./settings/{}.pem".format(config["key_name"])

    with open("./tmp/excludes", "w+") as f:
        f.write("\n".join(list(config["excludes"])))

    print("Decomissioning: ", list(config["excludes"]))

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

    """ Uncomment the line below if teardown is intended """ 
    # teardown("s", priv_ips=priv_ips_to_tear_down)
    print("Done.")