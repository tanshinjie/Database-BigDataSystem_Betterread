import subprocess
from util import * 
import time


if __name__ == "__main__":
    

    config = load_config('././settings/hadoop_config.json')
    mysql_private_ip = load_config('./settings/production_config.json')['mysql_private_ip']
    namenode_public_ip = config['namenode_public_ip']
    key_name = config['key_name']

    cmd1 = """ssh -i ./settings/{}.pem ubuntu@{} \"sudo su -c '/opt/sqoop-1.4.7/bin/sqoop import --connect jdbc:mysql://{}/kindle_reviews?useSSL=false --table reviews --fields-terminated-by _  --username admin --password password -m 1' hadoop\"""".format(key_name,namenode_public_ip,mysql_private_ip)        

    cmds = [cmd1]

    # for cmd in cmds:
        # subprocess.run(cmd,shell=True)

