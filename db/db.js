const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'study'
});

connection.connect(function(err){
    if (err) {
        console.log('err connecting:' + err.stack);
        return;
    }
    console.log('连接数据库成功！');
});

// 创建连接池，并导出连接池

module.exports = connection;