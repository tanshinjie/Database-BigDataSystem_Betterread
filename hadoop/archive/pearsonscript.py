# -*- coding: utf-8 -*-
"""
Created on Sun Dec  6 14:41:03 2020

@author: Fion
"""

import os 
import sys
from pyspark.sql import SparkSession
from pyspark.sql.functions import *

#Spark session
sparkName = ""
sparkCon = pyspark.SparkContext(sparkName)


#mysql csv input review file from hadoop
inputCsvFile = ""
reviews = spark.read.csv(inputCsvFile)

#Get average length of reviews
reviewsData = reviews.select('asin','reviewText').withColumn("reviewText", length(reviews.reviewText))
avgReviewLen = reviewsData.groupBy("asin").agg(mean("reviewText").alias("avgReviewLength"))


#Get price of book
inputMetadata = ""
metadata = spark.read.csv(inputMetadata)

#Get prices of books
prices = meta_df.select("asin", "price")

#Average length of reviews and corresponding price
data = avgReviewLen.join(prices, ["asin"])
data = data.select('price','avgReviewLength')

#Start calculations
datardd = data.rdd.map(list)

n = data.count()

xsum = rdd.map(lambda x: x[1]).sum()
ysum = rdd.map(lambda x: x[2]).sum()

sumx_squared = rdd.map(lambda x: x[1]**2).sum()
sumy_squared = rdd.map(lambda x: x[2]**2).sum()

xysum = rdd.map(lambda x: x[1]*x[2]).sum()

top = n * xysum - xsum*ysum
bot = math.sqrt((n*sumx_squared - xsum**2) * (n*sumy_squared - ysum**2))
corr = top/bot

print('Pearson Correlation = ', corr)

session.stop()