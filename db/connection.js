const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: "localhost",
        //Your MySQL username
        user: "root",
        //Your MySQL password
        password: "hey",
        database: "company",
      },
      console.log("Connected to the company database")
    );
  
    module.exports = db;