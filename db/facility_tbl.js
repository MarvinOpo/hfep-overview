let mysql = require('mysql');
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hfep_overview'
});
  
// connect to the MySQL server
connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
 
  let facilityTbl = `create table if not exists facility(
                          id int primary key auto_increment,
                          muncity_id varchar(5) not null,
                          name varchar(100) not null,
                          address varchar(100) not null,
                          license varchar(50) not null,
                          no_of_bed varchar(10) not null,
                          type varchar(50) not null,
                          imag
                      )`;
  
  connection.query(facilityTbl, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }

    console.log("Table created");
  });
 
  connection.end(function(err) {
    if (err) {
      return console.log(err.message);
    }
  });
}); 