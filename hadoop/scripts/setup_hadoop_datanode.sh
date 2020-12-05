#! /bin/bash

echo Setting up datanodes...

sudo su -c "sudo apt-get update" hadoop
sudo su -c "sudo apt-get install -y openjdk-8-jdk" hadoop

sudo su -c "tar zxf ~/hadoop-3.3.0.tgz -C ~/" hadoop
sudo su -c "sudo rm -rf /opt && sudo mkdir /opt" hadoop
sudo su -c "sudo cp -r ~/hadoop-3.3.0 /opt/" hadoop

sudo chown -R hadoop:hadoop /opt/hadoop-3.3.0/

sudo su -c "sudo mkdir -p /mnt/hadoop/datanode/" hadoop
sudo su -c "sudo chown -R hadoop:hadoop /mnt/hadoop/datanode/" hadoop

echo Done.