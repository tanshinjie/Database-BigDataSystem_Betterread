
#! /bin/bash
chmod +x script/spark_setup.sh
./spark_setup.sh

echo "Moving spark_setup.sh to worker nodes"
sudo su "scp -r scripts/spark_setup.sh hadoop@d1:~/" hadoop
sudo su "scp -r scripts/spark_setup.sh hadoop@d1:~/" hadoop
scp -r scripts/spark_setup.sh hadoop@d2:~/

##################################################
echo "run spark_setup.sh on all worker nodes"

ssh hadoop@d1 "./spark_setup.sh"

ssh hadoop@d2 "./spark_setup.sh"

echo Done.
