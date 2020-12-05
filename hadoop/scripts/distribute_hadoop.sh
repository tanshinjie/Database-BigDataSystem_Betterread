
#! /bin/bash
# this script is generated

echo Distributing hadoop to datanode...

sudo su -c 'scp ~/hadoop-3.3.0.tgz hadoop@172.31.19.126:~/' hadoop
sudo su -c 'scp ~/hadoop-3.3.0.tgz hadoop@172.31.29.68:~/' hadoop


echo Done.
