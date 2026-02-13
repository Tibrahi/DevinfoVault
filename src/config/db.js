// src/config/db.js
// Database connection (Node.js style, but since this is client-side demo, simulated)
// In a real setup, this would be server-side with Node.js and mysql2

// For demo, we're using localStorage as "DB"
// In production, use something like:

const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

function getConnection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });
}

module.exports = { getConnection };