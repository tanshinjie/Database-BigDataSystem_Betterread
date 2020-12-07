#! /bin/bash

# Download repo
# git clone https://github.com/tanshinjie/database_project 
# OR
# wget https://github.com/tanshinjie/database_project/archive/master.zip

echo "apt update && upgrade"
sudo apt update && sudo apt upgrade -y

echo "Install node && npm"
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "Install project dependencies"
cd ~/database_project/betterread-ui
npm install

cd ~/database_project/betterread-server
npm install

echo "Install Nginx"
sudo apt install nginx -y

echo "Configure Nginx"
cd ~/database_project
sudo cp nginx_config /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/nginx_config /etc/nginx/sites-enabled
sudo rm /etc/nginx/sites-available/default
sudo rm /etc/nginx/sites-enabled/default
sudo service nginx restart

echo "Build frontend"
sudo mkdir /var/www/betterread
cd ~/database_project/betterread-ui/
npm run build 
sudo cp -r build /var/www/betterread/

echo "Run backend"
cd ~/database_project/betterread-server/
node app.js

