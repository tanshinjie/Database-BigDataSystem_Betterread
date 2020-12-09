# file_manager.py

import os
import boto3
import json
# from pymongo import MongoClient
# from dotenv import load_dotenv


# load_dotenv(verbose=True)

def aws_session(region_name='us-east-1'):
    return boto3.session.Session(aws_access_key_id='ASIAVMPMSHONGSGE63XD',
                                aws_secret_access_key='9wj+nHFLMgQB/agW7AtXyIqBqMKiwGWZSLz2Jyuz',
                                region_name=region_name)

session = aws_session()
s3_resource = session.resource('s3')

def upload_file_to_bucket(bucket_name, file_path):
    session = aws_session()
    s3_resource = session.resource('s3')
    file_dir, file_name = os.path.split(file_path)

    bucket = s3_resource.Bucket(bucket_name)
    bucket.upload_file(
      Filename=file_path,
      Key=file_name,
      ExtraArgs={'ACL': 'public-read'}
    )

    s3_url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
    return s3_url

s3_url = upload_file_to_bucket('betterread', 'dummy') #insert .csv path from python module after calculations
print(s3_url) 





# a Python object (dict):
# python_obj = {
#   "url": s3_url
# }
# print(type(python_obj))
# # convert into JSON:
# j_data = json.dumps(python_obj)

# # result is a JSON string:
# print(j_data)


#Upload to mongo 
# client = MongoClient('localhost', 27017)
# db = client['url_db']
# collection_url = db['url_collection']
# collection_url.insert_one(python_obj)


# client.close()


