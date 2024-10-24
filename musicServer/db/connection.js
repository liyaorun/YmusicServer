const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',    // MySQL 服务器地址
    user: 'musicSql',         // MySQL 用户名
    password: '5sFAnfBjBcytnkAm', // MySQL 密码
    database: 'message'   // 使用的数据库名称
});

connection.connect((err) => {
    if (err) {
        console.error('数据库链接失败', err);
        return;
    }
    console.log('数据库链接成功');
});

module.exports = connection;