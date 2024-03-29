import subprocess
from util import *
import time

if __name__ == "__main__":
    start_time = time.time()
    config = load_config('./settings/hadoop_config.json')
    key_file = "./settings/{}.pem".format(config['key_name'])
    namenode_public_ip = config['namenode_public_ip']

    cmd1 = """ssh -i {} ubuntu@{} "sudo su -c 'sudo apt -y install python3-pip && pip3 install pyspark' hadoop"
    """.format(key_file,namenode_public_ip)
    subprocess.run(cmd1,shell=True)
    cmd2 = """ssh -i {} ubuntu@{} "sudo su -c 'export PYSPARK_PYTHON=python3 && python3 /home/ubuntu/analytics/tfidf.py' hadoop"
    """.format(key_file,namenode_public_ip)
    subprocess.run(cmd2,shell=True)
    print("--- {} seconds ---".format(time.time() - start_time))