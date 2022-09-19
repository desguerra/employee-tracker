const mysql = require('mysql2');
require('dotenv').config();

/* Connect to database */
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username
        user: 'root',
        // MySQL password
        password: process.env.KEY,
        database: 'election',
    },
    console.log('Connected to the employee database.')
);

module.exports = db;