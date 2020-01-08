# configRouter
通过配置文件，生成koa路由接口, 简单的增删查改

## 需求设想：
由于我是做前端开发，有时由于与后台开发不同步，造成接口无法及时写出，故设想自己利用nodejs与koa写出一个通过配置生成的接口；

## 功能模块：
1. 根据router.config.json文件，生成路由，根据里面的sql语句以及一些字段生成；
2. 使用mysql依赖连接数据库，利用连接池根据配置文件生成sql语句，实现增删查改功能；

router.config.json
```
{
    "routerList" : [
        { 
            "name": "list", 
            "type": "get", 
            "sql": "SELECT * FROM `test`" , 
            "handleType": "query"
        },
        { 
            "name": "delete", 
            "type": "post", 
            "sql": "Delete FROM `test`", 
            "params": ["id"], 
            "handleType": "delete"
        },
        { 
            "name": "add", 
            "type": "post", 
            "sql": "INSERT INTO test", 
            "updateField": ["userName", "sex", "age"], 
            "handleType": "add"
        },
        { 
            "name": "update", 
            "type": "post", 
            "sql": "UPDATE test SET ", 
            "updateField": ["userName", "sex", "age"], 
            "params": ["id"],  
            "handleType": "update"
        }
    ]
}
```
|  字段  |  描述  |
|:-------|:-:|
|name|koa路由的名字， 用来访问/name的方式访问|
|type|koa路由的类型，目前只测试了post和get请求|
|sql|sql语句的前面的部分，根据不同的handleType(增删查改),该语句不同，以及所有操作的表|
|params|请求的时候where的判断条件|
|handleType|数据库的操作类型，分为增删查改，对应的参数：add, delete, query, update|

## 代码较简单，只是利用nodejs监测配置文件，根据配置文件信息生成路由接口，但有很多可扩展以及局限性

