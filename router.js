const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const configUrl = path.resolve(__dirname, './router.config.json');
const process = require('process');
const db = require('./db/index.js');


create();
// 监测router.config.json文件
fs.watch(configUrl, (eventType, fileName) => {
    if (eventType == 'change') {
        exec(`kill -9 ${process.pid}`); // 获取进程id，并执行命令杀死进程
        exec(`npm start`); // 重新执行命令
    }
});
function create () {
    fs.readFile(configUrl,'utf8',(err,data) => {
        let routerList = JSON.parse(data).routerList;
        routerList.map(item => {
            router[item.type](`/${item.name}`, async (ctx,next) => {
                var sql= item.sql;
                if (!item.sql) {
                    ctx.body = `我是${item.name}`;
                    return ;
                };
                switch(item.handleType){
                    case "add":
                        if (item.updateField) {
                            var aSql = "(";
                            var bSql = "(";
                            item.updateField.map(item => {
                                aSql += (item + ",");
                                bSql += ("'" + (ctx.request.body[item] || ctx.query[item]) + "' ,");
                            });
                            aSql = aSql.slice(0,-1) + ")";
                            bSql = bSql.slice(0,-1) + ")";
                            sql += (aSql +  " VALUES " +  bSql);
                        }
                        break;
                    case "update":
                        if (item.updateField) {
                            item.updateField.map(item => {
                               sql += (item + " = '" + (ctx.request.body[item] || ctx.query[item]) + "',")
                            });
                            sql = sql.slice(0, -1);
                        }
                        break;
                    default:
                        break;
                          
                };
                if (item.params) {
                    var filterSql = " WHERE ";
                    item.params.map(item1 => {
                        if (item.type == 'post') {
                            filterSql += (item1 + "=" + ctx.request.body[item1]); 
                        }else if (item.type == 'get'){
                            filterSql += (item1 + "=" + ctx.query[item1]); 
                        }
                        
                    });
                    sql +=filterSql;
                }

                await db(sql).then(res => {
                    ctx.body = {
                        status: 200,
                        data: res,
                        msg: '成功！'
                    }
                }).catch(err => {
                    ctx.body = {
                        status: 500,
                        msg: '服务器错误！',
                        data: err
                    };
                });
                await next();
                
            });
        });
    });
};


module.exports = router;