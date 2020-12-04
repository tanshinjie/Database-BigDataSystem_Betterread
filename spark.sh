#!/bin/bash

echo "=== Starting setup for Spark ==="
# download Spark
wget https://downloads.apache.org/spark/spark-3.0.1/spark-3.0.1-bin-hadoop2.7.tgz -O spark-3.0.1-bin-hadoop2.7.tgz
tar -xzf spark-3.0.1-bin-hadoop2.7.tgz
mv spark-3.0.1-bin-hadoop2.7/ spark
sudo mv spark/ /usr/lib/


echo "=== Configuring Spark ==="
# configure Spark
cp /usr/lib/spark/conf/spark-env.sh.template /usr/lib/spark/conf/spark-env.sh 

cat >> /usr/lib/spark/conf/spark-env.sh << EOF
JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
SPARK_WORKER_MEMORY=4g
PYSPARK_PYTHON=python3
./bin/pyspark
EOF

echo "=== Configuring Spark ==="
echo "=== Installing Java ==="
# install java
sudo apt-get -y update
sudo apt install -y default-jre
sudo apt install -y default-jdk

sudo apt-get install -y python3-pip
pip3 install pyspark --no-cache-dir
pip3 install pymongo --no-cache-dir

# install sbt
echo "deb https://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list
curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | sudo apt-key add
sudo apt-get update
sudo apt-get install sbt

source ~/.profile

echo "=== Editing profile ==="
cat >> ~/.profile << EOF
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export SBT_HOME=/usr/share/sbt-launcher-packaging/bin/sbt-launch.jar
export SPARK_HOME=/usr/lib/spark
export PATH=$PATH:$JAVA_HOME/bin
export PATH=$PATH:$SBT_HOME/bin:$SPARK_HOME/bin:$SPARK_HOME/sbin
EOF

echo "checkpoint for error"

source ~/.profile
echo "checkpoint for error #2"

exec bash
echo "checkpoint for error #3"

echo "=== Completed Spark Setup ==="
