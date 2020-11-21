#!/bin/bash

echo "=== Running Set Up for Mongo Instance === "

# download mongo
{
    wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
    echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
} || {
    # catch
    echo "ERROR: installing mongodb"
}

# download data
{
    wget -c wget -c https://istd50043.s3-ap-southeast-1.amazonaws.com/meta_kindle_store.zip -O meta_kindle_store.zip -O meta_kindle_store.zip
    sudo apt install unzip
    unzip meta_kindle_store.zip
    rm -rf *.zip
    wget -c https://www.dropbox.com/s/5tn7fuh7czfbjya/setupmongo.js?dl=0 -O setupmongo.js
} || {
    # catch
    echo "ERROR: downloading data"
}

{
    sudo service mongod start
} || {
    sudo systemctl enable mongod
    sudo service mongod start
}

# set up admin user

while :
do
    if mongo localhost:27017/admin --eval 'db.createUser({ user: "admin", pwd: "password", roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]})' ; then
        break
    else
        echo "Command failed, retrying..."
    fi
done


echo "Changing mongd.conf"
sudo sed -i "s,\\(^[[:blank:]]*bindIp:\\) .*,\\1 0.0.0.0," /etc/mongod.conf
sudo sh -c 'echo "security:\n  authorization : enabled" >> /etc/mongod.conf'
sudo service mongod restart

# import dataset
{
    echo "Importing dataset"
    mongoimport -d isit_database_mongo -c kindle_metadata --file meta_Kindle_Store.json --authenticationDatabase admin --username 'admin' --password 'password' --legacy
    mongoimport -d isit_database_mongo -c categories --drop --file categories.json --authenticationDatabase admin --username 'admin' --password 'password'
} || {
    echo "ERROR: importing data to mongo"
}

echo "=== Finished Set Up for Mongo Instance === "