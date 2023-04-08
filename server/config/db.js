var mysql = require('mysql');
const db = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '5374',
    database: 'pwa_crud'
});

module.exports = db;