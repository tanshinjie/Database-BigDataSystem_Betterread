import subprocess
from util import * 
import paramiko

if __name__ == "__main__":
    mongo_ip = input("Private IP of MongoDB: ")

    config = load_config('././settings/post_config.json')
    namenode_public_ip = config['namenode_public_ip']
    key_name = config['key_name']
    key = paramiko.RSAKey.from_private_key_file('././settings/' + key_name + ".pem")

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:

        client.connect(hostname=namenode_public_ip, username="ubuntu", pkey=key)

        cmd1 = "sudo su -c 'wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu1804-x86_64-100.2.1.deb' hadoop"
        cmd2 = "sudo apt install ./mongodb-database-tools-*-100.2.1.deb"
        cmd3 = 'mongoexport --uri="mongodb://{}:27017/dbMeta"/ --collection=kindle_metadata --out=metadata.json --username admin --password password --authenticationDatabase admin'.format(mongo_ip)
        cmd4 = "sudo su -c '/opt/hadoop-3.3.0/bin/hdfs dfs -mkdir /metadata' hadoop"
        cmd5 = "sudo su -c '/opt/hadoop-3.3.0/bin/hdfs dfs -put ./metadata.json /metadata' hadoop"

        cmds = [cmd5]

        for cmd in cmds:
            print(cmd)
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.read().decode())
            print(stdout.channel.recv_exit_status())

        client.close()


    except Exception as e:
        print(e)

