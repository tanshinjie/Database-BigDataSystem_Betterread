
echo Scaling up hadoop...

sudo su -c "ssh -o 'StrictHostKeyChecking no' 172.31.92.44 'echo 1 > /dev/null'" hadoop
sudo su -c "ssh -o 'StrictHostKeyChecking no' 172.31.80.173 'echo 1 > /dev/null'" hadoop

sudo su -c 'echo 172.31.92.44 >> /home/hadoop/includes' hadoop
sudo su -c 'ssh hadoop@172.31.92.44 "bash /home/ubuntu/setup_hadoop_datanode.sh"' hadoop

sudo su -c 'echo 172.31.80.173 >> /home/hadoop/includes' hadoop
sudo su -c 'ssh hadoop@172.31.80.173 "bash /home/ubuntu/setup_hadoop_datanode.sh"' hadoop


#/opt/hadoop-3.3.0/bin/yarn rmadmin -refreshNodes
#/opt/hadoop-3.3.0/bin/hdfs dfsadmin -refreshNodes
#/opt/hadoop-3.3.0/bin/hdfs dfsadmin -report

echo Done.