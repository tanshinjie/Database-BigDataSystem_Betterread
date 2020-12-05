#! /bin/bash

echo Starting namenode...

sudo su -c "sudo rm -rf /opt && sudo mkdir /opt" hadoop
sudo su -c "sudo cp -r ~/hadoop-3.3.0 /opt/" hadoop

sudo chown -R hadoop:hadoop /opt/hadoop-3.3.0/

sudo mkdir -p /mnt/hadoop/namenode/hadoop-hadoop
sudo chown -R hadoop:hadoop /mnt/hadoop/namenode

sudo su -c "/opt/hadoop-3.3.0/bin/hdfs namenode -format <<< 'Y'" hadoop

sudo su -c "/opt/hadoop-3.3.0/sbin/start-dfs.sh && /opt/hadoop-3.3.0/sbin/start-yarn.sh" hadoop

sudo su -c "/opt/hadoop-3.3.0/bin/hdfs dfsadmin -report" hadoop

echo Done.