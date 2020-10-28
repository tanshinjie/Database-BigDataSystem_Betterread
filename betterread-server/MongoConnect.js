const { MongoClient } = require('mongodb');
const uri = "mongodb://root:12345@ec2-3-236-254-171.compute-1.amazonaws.com:27017";
const client = new MongoClient(uri);

const connectToDB= async()=>{
  try {
    
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("MongoDB is connected!")
  
    // Make the appropriate DB calls
    //await listDatabases(client);
  
  } catch (e) {
    console.error(e);
  } 
}
module.exports.client = client;
module.exports.connectToDB= connectToDB;