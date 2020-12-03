#! /bin/bash

echo Setting up namenode...
sudo su -c "sudo apt-get update" hadoop
sudo su -c "sudo apt-get install -y openjdk-8-jdk" hadoop

echo Downloading hadoop...
sudo su -c "wget https://apachemirror.sg.wuchna.com/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz -P ~/" hadoop

echo Unzipping hadoop...
sudo su -c "tar zxf ~/hadoop-3.3.0.tar.gz -C ~/" hadoop

###sudo su -c "wget https://sourceforge.net/projects/typo3/files/OldFiles/dummy-4.0.4.tar.gz -P ~/" hadoop
###sudo su -c "tar xzvf ~/dummy-4.0.4.tar.gz -C ~/" hadoop

sudo su -c "sed -i \"s/# export JAVA_HOME=.*/export JAVA_HOME=\/usr\/lib\/jvm\/java-8-openjdk-amd64/g\" ~/hadoop-3.3.0/etc/hadoop/hadoop-env.sh" hadoop

sudo su -c "bash scripts/setup_hadoop_config.sh" hadoop

# sudo su -c "tar czvf ~/dummy-4.0.4.tgz -C ~/ dummy-4.0.4" hadoop
sudo su -c "tar czf ~/hadoop-3.3.0.tgz -C ~/ hadoop-3.3.0" hadoop

sudo su -c "bash /home/ubuntu/scripts/disable_strict_host_ssh.sh" hadoop
sudo su -c "bash /home/ubuntu/scripts/distribute_hadoop.sh" hadoop

echo Done.
