#! /bin/bash

<<<<<<< HEAD
if [ -f ~/tmp/excludes ];then
    sudo chown hadoop:hadoop ~/tmp/excludes
    sudo cp ~/tmp/excludes /home/hadoop/
fi

if [ -f ~/tmp/includes ];then
    sudo chown hadoop:hadoop ~/tmp/includes
    sudo cp ~/tmp/includes /home/hadoop/
fi
=======
sudo chown hadoop:hadoop ~/tmp/excludes
sudo mv ~/tmp/excludes /home/hadoop/

sudo chown hadoop:hadoop ~/tmp/includes
sudo mv ~/tmp/includes /home/hadoop/
>>>>>>> dev

sudo su -c "/opt/hadoop-3.3.0/bin/yarn rmadmin -refreshNodes" hadoop
sudo su -c "/opt/hadoop-3.3.0/bin/hdfs dfsadmin -refreshNodes" hadoop
sudo su -c "/opt/hadoop-3.3.0/bin/hdfs dfsadmin -report" hadoop
