#! /bin/bash

echo Restarting Hadoop namenode...

sudo su -c "/opt/hadoop-3.3.0/sbin/stop-dfs.sh && /opt/hadoop-3.3.0/sbin/stop-yarn.sh" hadoop

sudo su -c "/opt/hadoop-3.3.0/sbin/start-dfs.sh && /opt/hadoop-3.3.0/sbin/start-yarn.sh" hadoop

sudo su -c "/opt/hadoop-3.3.0/bin/hdfs dfsadmin -report" hadoop

echo Done.