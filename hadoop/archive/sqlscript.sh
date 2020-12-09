
sudo apt update
sudo apt-get install mysql-server -y
sudo apt install unzip

# Add right for root user
sudo mysql -e 'update mysql.user set plugin = "mysql_native_password" where User="root"'
sudo mysql -e 'create user "root"@"%" identified by ""'
sudo mysql -e 'grant all privileges on *.* to "root"@"%" with grant option'
sudo mysql -e 'flush privileges'
sudo service mysql restart


# Download dataset
wget -c https://istd50043.s3-ap-southeast-1.amazonaws.com/kindle-reviews.zip -O kindle-reviews.zip -O kindle-reviews.zip
unzip kindle-reviews.zip
rm -rf kindle_reviews.json

mysql -u root <<'EOF'
set global local_infile=true;
CREATE USER 'admin'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
EOF

# Load csv into database
mysql --local_infile=1 -u root <<'EOF'
CREATE DATABASE IF NOT EXISTS kindle_reviews;
USE kindle_reviews;
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
`id` INT(11) NOT NULL AUTO_INCREMENT,
`asin` VARCHAR(255) NOT NULL,
`helpful` VARCHAR(255) NOT NULL,
`overall` INT(11) NOT NULL,
`reviewText` TEXT NOT NULL,
`reviewTime` VARCHAR(255) NOT NULL,
`reviewerID` VARCHAR(255) NOT NULL,
`reviewerName` VARCHAR(255) NOT NULL,
`summary` VARCHAR(255) NOT NULL,
`unixReviewTime` INT(11) NOT NULL,PRIMARY KEY (`id`));
LOAD DATA LOCAL INFILE 'kindle_reviews.csv' INTO TABLE reviews FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;
CREATE INDEX asin ON reviews(asin);
EOF

echo "Finish set up"