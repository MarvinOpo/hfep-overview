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
 
  let projectTbl = `create table if not exists project(
                          id int primary key auto_increment,
                          facility_id varchar(20),
                          contractor_id varchar(20),
                          name varchar(50) not null,
                          fund_source varchar(20) not null,
                          funding_year varchar(10) not null,
                          allotment varchar(20) not null,
                          agency varchar(20) not null,
                          mayor varchar(50) not null,
                          start_date date,
                          end_date date,
                          revise_expiry date,
                          status varchar(20) not null,
                          images text,
                          remarks varchar(100)
                      )`;
  
  connection.query(projectTbl, function(err, results, fields) {
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