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
 
  let muncityTbl = `create table if not exists municipality(
                          id int primary key auto_increment,
                          name varchar(20) not null,
                          province varchar(20) not null,
                          district varchar(20) not null,
                          mayor varchar(50) not null,
                          population varchar(10) not null,
                          MHO_CHO varchar(150),
                          PDOH varchar(150),
                          DMO varchar(150),
                          MUN_ENGR varchar(150),
                          LGU varchar(150),
                          POINT_PERSON varchar(150)
                      )`;
  
  connection.query(muncityTbl, function(err, results, fields) {
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