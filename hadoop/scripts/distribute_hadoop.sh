
#! /bin/bash
# this script is generated

echo Distributing hadoop to datanode...

sudo su -c 'scp ~/hadoop-3.3.0.tgz hadoop@172.31.62.75:~/' hadoop
sudo su -c 'scp ~/hadoop-3.3.0.tgz hadoop@172.31.48.228:~/' hadoop
sudo su -c 'scp ~/hadoop-3.3.0.tgz hadoop@172.31.53.133:~/' hadoop


echo Done.
