const db = require('./db.js');


const querySql = (db) => {
    return (sql) => {
        return new Promise ((resolve, reject) => {
            db.query(sql,function(err,data){
                if (err) {
                    reject(err);
                    return ;
                }
                resolve(data);
            });
        })
    }
};

module.exports = querySql(db);