#! /bin/bash
echo Distributing hadoop to datanode...

sudo su -c 'scp ~/hadoop-3.3.0.tgz hadoop@172.31.63.129:~/' hadoop
echo Done.
            