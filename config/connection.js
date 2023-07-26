const mysql = require("mysql2");
require('dotenv').config();

//mysql connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: 'employees_DB',
});

module.exports = connection;