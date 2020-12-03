#! /bin/bash

echo "Creating Hadoop User..."
if [ $(grep -c '^hadoop:' /etc/passwd) ]; then
sudo deluser hadoop
fi
if [ -d /home/hadoop ]; then 
sudo rm -rf /home/hadoop/
fi 
sudo useradd -m -s /bin/bash hadoop
sudo sh -c 'echo "hadoop ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/90-hadoop'

sudo sh -c "mkdir /home/hadoop/.ssh"
sudo chown -R hadoop:hadoop /home/hadoop/.ssh

sudo sysctl vm.swappiness=10

sudo rm /etc/hosts
sudo mv ~/tmp/hosts /etc/hosts
