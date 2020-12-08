wget https://apachemirror.sg.wuchna.com/sqoop/1.4.7/sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
tar zxvf sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
cp sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env-template.sh sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env.sh
export HD="\/opt\/hadoop-3.3.0"
sed -i "s/#export HADOOP_COMMON_HOME=.*/export HADOOP_COMMON_HOME=${HD}/g" sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env.sh
sed -i "s/#export HADOOP_MAPRED_HOME=.*/export HADOOP_MAPRED_HOME=${HD}/g" sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env.sh
wget https://repo1.maven.org/maven2/commons-lang/commons-lang/2.6/commons-lang-2.6.jar
cp commons-lang-2.6.jar sqoop-1.4.7.bin__hadoop-2.6.0/lib/
sudo cp -rf sqoop-1.4.7.bin__hadoop-2.6.0 /opt/sqoop-1.4.7
wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.49.tar.gz
tar xvfz mysql-connector-java-5.1.49.tar.gz
sudo cp ~/mysql-connector-java-5.1.49/mysql-connector-java-5.1.49-bin.jar /opt/sqoop-1.4.7/lib/