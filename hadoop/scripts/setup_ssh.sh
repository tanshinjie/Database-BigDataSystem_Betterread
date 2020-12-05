#! /bin/bash

echo "Setting up SSH"
sudo apt-get install -y ssh
sudo su -c "ssh-keygen -N '' -f ~/.ssh/id_rsa <<< y" hadoop
sudo su -c "cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys" hadoop