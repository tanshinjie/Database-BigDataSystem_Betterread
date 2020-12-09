#Run as user hadoop on namenode

#########Download##########
cd ~
mkdir download
cd download
wget https://apachemirror.sg.wuchna.com/spark/spark-3.0.1/spark-3.0.1-bin-hadoop3.2.tgz
tar zxvf spark-3.0.1-bin-hadoop3.2.tgz

#########Configure#########
cp spark-3.0.1-bin-hadoop3.2/conf/spark-env.sh.template /spark-3.0.1-bin-hadoop3.2/conf/spark-env.sh
echo "
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export HADOOP_HOME=/opt/hadoop-3.3.0
export SPARK_HOME=/opt/spark-3.0.1-bin-hadoop3.2
export SPARK_CONF_DIR=\${SPARK_HOME}/conf
export HADOOP_CONF_DIR=\${HADOOP_HOME}/etc/hadoop
export YARN_CONF_DIR=\${HADOOP_HOME}/etc/hadoop
export SPARK_EXECUTOR_CORES=1
export SPARK_EXECUTOR_MEMORY=2G
export SPARK_DRIVER_MEMORY=1G
export PYSPARK_PYTHON=python3
" >> spark-3.0.1-bin-hadoop3.2/conf/spark-env.sh

WORKERS="d1 d2" #edit this in script generator
for ip in ${WORKERS};
do echo -e "${ip}" >> spark-3.0.1-bin-hadoop3.2/conf/slaves;
done

########Deploy to workers########
tar czvf spark-3.0.1-bin-hadoop3.2.tgz spark-3.0.1-bin-hadoop3.2/
for i in ${WORKERS};
do scp spark-3.0.1-bin-hadoop3.2.tgz $i:./spark-3.0.1-bin-hadoop3.2.tgz;
   #scp scripts/spark_install.sh $i:~/;
   echo 'installing on WORKERS'
   ssh hadoop@$i 'cd ~'
   ssh hadoop@$i 'tar zxvf spark-3.0.1-bin-hadoop3.2.tgz'
   ssh hadoop@$i 'sudo mv spark-3.0.1-bin-hadoop3.2 /opt/'
   ssh hadoop@$i 'sudo chown -R hadoop:hadoop /opt/spark-3.0.1-bin-hadoop3.2'
#######################spark_install.sh############################
## cd ~                                                          ##
## tar zxvf spark-3.0.1-bin-hadoop3.2.tgz                        ##
## sudo mv spark-3.0.1-bin-hadoop3.2 /opt/                       ##
## sudo chown -R hadoop:hadoop /opt/spark-3.0.1-bin-hadoop3.2    ##
##################################################################
done
mv spark-3.0.1-bin-hadoop3.2.tgz ~/.

###############Install on namenode#############
cd ~
tar zxvf spark-3.0.1-bin-hadoop3.2.tgz
sudo mv spark-3.0.1-bin-hadoop3.2 /opt/
sudo chown -R hadoop:hadoop /opt/spark-3.0.1-bin-hadoop3.2

############START#############
/opt/hadoop-3.3.0/sbin/start-dfs.sh && /opt/hadoop-3.3.0/sbin/start-yarn.sh
/opt/spark-3.0.1-bin-hadoop3.2/sbin/start-all.sh
echo "NAMENODE JPS"
jps
for j in ${WORKERS};
do echo 'WORKERNODE JPS'
   ssh hadoop@$j 'jps'
done


sudo apt -y install python3-pip
pip3 install pyspark