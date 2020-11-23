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
    #wget -c https://www.dropbox.com/s/2loaok4f4dda580/metadata_clean.txt?dl=0t -O metadata_clean.txt
    wget -c https://metadataclean.s3.amazonaws.com/metadata.json -O metadata_clean.json
    wget -c https://metadataclean.s3.amazonaws.com/book_title_author.json -O title_author.json
    wget -c https://www.dropbox.com/s/9f209e96fpntmod/mongod.conf?dl=0 -O mongod.conf
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

if mongo localhost:27017/admin --eval 'db.createUser({ user: "admin", pwd: "password", roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]})' ; then
        break
    else
        echo "Command failed, retrying..."
    fi


echo "Changing mongod.conf"
# sudo sed -i "s,\\(^[[:blank:]]*bindIp:\\) .*,\\1 0.0.0.0," /etc/mongod.conf
# sudo sh -c 'echo "security:\n  authorization : enabled" >> /etc/mongod.conf'
sudo cat mongod.conf > /etc/mongod.conf #replace  conf file 
sudo service mongod restart

# import dataset
{
    echo "Importing dataset"
    mongoimport -d dbMeta -c kindle_metadata --file metadata_clean.json --authenticationDatabase admin --username 'admin' --password 'password' --jsonArray
    mongoimport -d dbMeta -c title_author --file title_author.json --authenticationDatabase admin --username 'admin' --password 'password' --jsonArray
} || {
    echo "ERROR: importing data to mongo"
}

echo "=== Finished Set Up for Mongo Instance === "
