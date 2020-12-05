
#! /bin/bash
# this script is generated

echo Adding configuration...

sudo su -c 'cat ./tmp/core-site.xml > ~/hadoop-3.3.0/etc/hadoop/core-site.xml' hadoop
sudo su -c 'cat ./tmp/hdfs-site.xml > ~/hadoop-3.3.0/etc/hadoop/hdfs-site.xml' hadoop
sudo su -c 'cat ./tmp/yarn-site.xml > ~/hadoop-3.3.0/etc/hadoop/yarn-site.xml' hadoop
sudo su -c 'cat ./tmp/mapred-site.xml > ~/hadoop-3.3.0/etc/hadoop/mapred-site.xml' hadoop

sudo su -c "rm ~/hadoop-3.3.0/etc/hadoop/workers" hadoop
sudo su -c 'echo d1 >> ~/hadoop-3.3.0/etc/hadoop/workers' hadoop
sudo su -c 'echo d2 >> ~/hadoop-3.3.0/etc/hadoop/workers' hadoop


echo Done.
