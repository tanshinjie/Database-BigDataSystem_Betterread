# README

## Automation Prerequisites

python3\
boto3\
paramiko

## Instructions

Clone the project repository using the following command
git clone https://github.com/tanshinjie/database_project.git

For all system. please copy paste the AWS credentials `aws_access_key_id` , ` aws_secret_access_key`, ` aws_session_token` into **aws_token.txt**. The credentials will be parsed into automation script at the beginning of script.

During the setup, any new key-pair generated will be stored under `hadoop/settings` directory. Keep the key in the directory as the path will be referenced for later configuration.

Note: In case of any error, please ensure the local copy of the public key and corresponding key-pair entry on AWS are removed before retrying.
The script will assume clean setup everytime.

### Production System

To setup the web servers and databases, specify the parameters in the given `config.json` under `/hadoop/settings`directory. A new config file named `prod_config.json` will also be updated with other parameters after the creation of the servers. \
Execute
`python3 setup.py` to launch three new EC2 servers.
For inital setup, the parameters consulted by the scripts are:

1. region_name
2. security_group_name
3. key_name
4. number_of_production_server
5. server details: image_id, instance_type, block_device_mappings

The setup will prompt for Github username and password, kindly fill in your credentials.
The estimated time for the setup is around 10 - 15 minutes.
At the end of this setup, a updated config file named `production_config.json` will be generated under `/settings` directory.

### Analytics System

Similar to production system, `config.json` will also be consulted to the setup of hadoop cluster with spark.
For inital setup, the parameters consulted by the scripts are:

1. region_name
2. security_group_name
3. key_name
4. number_of_analytics_server
5. server details: image_id, instance_type, block_device_mappings

Execute `python3 hadoop_setup.py` to setup the hadoop cluster.
The estimated time for the setup is around 10 - 15 minutes.
At the end of this setup, a updated config file named `hadoop_config.json` will be generated under `/settings` directory.

## Data Ingestion

##### MongoDB

Execute `python3 mongo_ingest.py`. The script will consult `production_config.json` for private IP address of the MongoDB. At the end of the script, the metadata of books will be stored and distributed into the hadoop cluster.

Execute `python3 mysql_ingest.py`. The script will consult `production_config.json` for private IP address of the MySQL. At the end of the script, the metadata of reviews will be stored and distributed into the hadoop cluster.

## Scaling Hadoop

### Commissioning

To add new datanode, execute `python3 hadoop_scale_up.py` . The script will consult additional parameters such as **scale factor**, **namenode_public_ip** from `hadoop_config.json` to determine the number of new datanode to be added and the namenode ip address. New EC2 instances will be created according to the configuration and key specified in the
`hadoop_config.json` .

### Decommissioning

To remove existing datanode, first includes the hostsname of the datanode in the **excludes** list under `hadoop_config.json`. Then, execute `hadoop_scale_down.py`.
The script will automatically decommission the datanode by their hostnames, the instance teardown is optional. Kindly uncomment the respective teardown function call if teardown is intended.

## Features

### Prodcution

The production system has the following features:

1. Search books by author, title
2. Apply "Genre" and "Ratings" filter when searching
3. Add new books to database
4. Add new reviews to database
5. Get reviews by asin
6. Random name generator for reviewer

### Analytics

The analytics system has the following features:

1. Data ingestion
2. Pearson Correlation
3. TF-IDF
4. Scaling of Hadoop Cluster
5. Easy Start / Stop of Hadoop Cluster

## Extra Efforts

As the dataset provided does not have important information such as title and author required by the application, we programmed a python web crawler to scrapt the title and author to complement the given dataset. The crawler script can be found under `/helper` directory.

## Data Schema

### 1. Books Metadata (MongoDB)

- `id`: ObjectId, primary key
- `asin`: String
- `price`: Double
- `imUr`l: String
- `related`: Object
  - `also_bough`t: String[]
  - `buy_afterviewing`: String[]
- `categories`: String[]
- `title`: String
- `author`: String

### 2. Logs (MongoDB)

- `timeStamp`: String
- `reqType`: String
- `resCode`: Number
- `url`: String

### 3. Review Data (MySQL)

- `id` INT(11) NOT NULL AUTO_INCREMENT
- `asin` VARCHAR(255) NOT NULL,
- `helpful` VARCHAR(255) NOT NULL,
- `overall` INT(11) NOT NULL,
- `reviewText` TEXT NOT NULL,
- `reviewTime` VARCHAR(255) NOT NULL,
- `reviewerID` VARCHAR(255) NOT NULL,
- `reviewerName` VARCHAR(255) NOT NULL,
- `summary` VARCHAR(255) NOT NULL,
- `unixReviewTime` INT(11) NOT NULL,PRIMARY KEY (`id`));

## Analytics Description

1. Pearson Correlation

- _Correlation_: compute the Pearson correlation between price and average review length.
- The book prices and ASIN are retreved from the book metadata. The average review length for a book is calculated for each ASIN. The values are then used to calculate the Pearson Correalation.

- Pearson Correlation: We first get the reviewText from MySQL database and compute the average review length for each book. Next, we get the price of book from MongoDB books metadata. We then combine both the values into one dataframe and execute the calculation for Pearson Correlation according to this formula:
  ![](https://i.imgur.com/z2Z48Mc.jpg)
- for the calculation there are 5 terms which can be map-reduced.
  - sum(average review length)
  - sum(book price)
  - sum(square(average review length))
  - sum(square(book price))
  - sum((book price)\*(average review length))

The script after running the 5 map-reduce jobs combines them as in the img above and prints out the final Pearson Correlation value.

2. _TF-IDF_: compute the term frequency inverse document frequency metric on the review text. Treat one review as a document.

- TFIDF - We import MYSQL table containing the reviewText into hadoop and tokenize the data into a list of words. For each word, we calculate the term frequency(tf) values storing them as vectors. Next, we calculate their inverse document frequency(idf), treating each review as 1 document. Having the final tfidf value, we get the actual word from their index in the vectors and return it as a csv file.

### Overview

The EC2 instances will be setup as in the following structure
| Instance Number | Content | Details |
|-----------------|-------------------------|----------------|
| 1 | <ul><li>Frontend (React)</li><li>Backend (Express)</li></ul> | The frontend is served at port 80 and backend is hosted at port 5000, the website can be viewed at &lt;public IP> . The backend retrieves information from the databases via their IP addresses. |
| 2 | Kindle Reviews (MySQL) | The data can be accessed by the backend and namenode at &lt;private IP&gt;:3306. |
| 3 | <ul><li>Books Metadata (MongoDB)</li><li>Logs (MongoDB)</li> </ul> | The data can be accessed by the backend and namenode at &lt;private IP&gt;:27017. |
| 4 | <ul><li>Namenode (HDFS)</li><li>Driver (Spark)</li></ul> | The namenode is configured to store the public DNS of the datanodes. When the client issues an analytics job, data is retrieved from the databases via their IP addresses. The driver delegates tasks to the workers by ssh-ing into the datanodes. Upon completion, the driver returns the output file. |
| 5+ | <ul><li>Datanode (HDFS)</li><li>Worker (Spark)</li></ul> | The worker performs the tasks assigned by the driver. |
