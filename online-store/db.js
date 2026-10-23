require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((error, connection) => {
    if (error) {
        console.error('Ошибка пула подключений к MySQL:', error);
        return;
    }
    console.log('MySQL Pool connected успешно к серверу 31.76.12.103!');
    connection.release();
});

module.exports = pool;
