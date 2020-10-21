let mysql = require('mysql');

let connection = mysql.createConnection({
    host: '54.166.186.251',
    port: 3340,
    user: 'root',
    password: '',
    database: 'kindle_reviews'
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });

$query = 'SELECT asin from reviews limit 1';

connection.query($query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
        return;
    }

    console.log("Query succesfully executed: ", rows);
});

