const Koa = require('koa');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const router  = require('./router.js');


const app = new Koa();


app.use(static('./public'));
app.use(bodyParser());

app.use(router.routes());


app.listen(3000,()=>{
	console.log('http://localhost:3000');
});

