<<<<<<< HEAD
sudo su -c "ssh -o 'StrictHostKeyChecking no' d2 'echo 1 > /dev/null'" hadoop
sudo su -c "ssh -o 'StrictHostKeyChecking no' d3 'echo 1 > /dev/null'" hadoop
=======

#! /bin/bash
# this script is generated

echo Disabling StrictHostKeyChecking...

sudo su -c "ssh -o 'StrictHostKeyChecking no' d3 'echo 1 > /dev/null'" hadoop


echo Done.
>>>>>>> dev