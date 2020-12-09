import subprocess
from util import * 

if __name__ == "__main__":
    mongo_ip = input("Private IP of MongoDB: ")

    config = load_config('./settings/hadoop_config.json')
    namenode_public_ip = config['namenode_public_ip']
    key_name = config['key_name']

    cmd1 = """ssh -i ./settings/{}.pem ubuntu@{} \"sudo su -c 'sudo wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu1804-x86_64-100.2.1.deb' hadoop\"""".format(key_name,namenode_public_ip)        
    cmd2 = """ssh -i ./settings/{}.pem ubuntu@{} \"sudo su -c 'sudo apt install ./mongodb-database-tools-*-100.2.1.deb' hadoop\"""".format(key_name,namenode_public_ip)        
    cmd3 = """ssh -i ./settings/{}.pem ubuntu@{} \"sudo su -c 'mongoexport --uri=mongodb://{}:27017/dbMeta --collection=kindle_metadata --out=/home/hadoop/metadata.json --username admin --password password --authenticationDatabase admin' hadoop\"""".format(key_name,namenode_public_ip,mongo_ip)        
    cmd4 = """ssh -i ./settings/{}.pem ubuntu@{} \"sudo su -c '/opt/hadoop-3.3.0/bin/hdfs dfs -mkdir /metadata' hadoop\"""".format(key_name,namenode_public_ip,mongo_ip)        
    cmd5 = """ssh -i ./settings/{}.pem ubuntu@{} \"sudo su -c '/opt/hadoop-3.3.0/bin/hdfs dfs -put /home/hadoop/metadata.json /metadata' hadoop\"""".format(key_name,namenode_public_ip,mongo_ip)        

    cmds = [cmd1,cmd2,cmd3,cmd4,cmd5]

    for cmd in cmds:
        subprocess.run(cmd,shell=True)
