
#! /bin/bash
# this script is generated

echo Appending new datanode to workers...

sudo su -c 'echo d2 >> /opt/hadoop-3.3.0/etc/hadoop/workers' hadoop


echo Done.
