const mysql = require('mysql');
const dotenv = require('dotenv');

//load env file
require('dotenv').config();

// create connention
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
  })

db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      process.exit(1);
    }
    console.log('Connected to the database');
  });
  
module.exports = db;