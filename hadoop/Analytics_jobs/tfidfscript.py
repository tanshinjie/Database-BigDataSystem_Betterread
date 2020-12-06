# -*- coding: utf-8 -*-
"""
Created on Sun Dec  6 04:36:23 2020

@author: Fion
"""

import os 
import sys
from pyspark.sql import SparkSession
from pyspark.ml.feature import Tokenizer, HashingTF, IDF, CountVectorizer

#myysql csv input review file from hadoop
inputCsvFile = ""
reviews = spark.read.csv(inputCsvFile)

#Spark session
sparkName = ""
sparkCon = pyspark.SparkContext(sparkName)



#tokenize words
tokenizer = Tokenizer(inputCol = 'reviewText',outputCol = 'words')
wordsVec = tokenizer.transform(reviews)

#get tf values
countVec = CountVectorizer(inputCol="words", outputCol="tf")
tf_model = cv.fit(wordsVec)
featured_data = model.transform(wordsVec)

#get idf values
idf = IDF(inputCol="tf", outputCol="idf")
idf_model = idf.fit(feature_data)
rescaled_data = idf_model.transform(featured_data)
#rescaled_data.select("idf").show()

vocab = model.vocabulary

#get word from countvec index
def getwords(vec):
    for (idx, tfidfval) in zip(vec.indices, vec.values):
        return vocab[idx]
    
def toString(vec):
        words = ""
    for (idx, tfidfval) in zip(vec.indices, vec.values):
        currentword = vocab[idx] + ":" + str(float(tfidfval)) + ", "
        words += currentword
    return words[:-2]


selection = rescaled_data.select('reviewerID', 'asin', 'reviewTime', 'features')
out = selection.rdd.map(lambda x: [x[0], x[1], x[2], save_as_string(x[3])])
df = session.createDataFrame(out, ['reviewerID', 'asin', 'reviewTime', 'tfidf'])
df.write.csv('tfidf_output.csv')
session.stop()