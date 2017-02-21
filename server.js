const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
let clients = [];

router.get('/subscribe', async (ctx) => {
 
  console.log('subsribe');
  
 let promise =  new Promise((resolve, reject) => {
   clients.push(resolve);
   
   ctx.res.on('close', () => {
     const err = new Error('Connection closed');
     err.code = 'ECONNRESET';
     reject(err);
   });
 });
  
  let message;
  
  try {
    message = await promise;
  } catch (err) {
    if(err.code === 'ECONNRESET') return;
     
    throw err;
  }
  
 ctx.body = message;
});

router.post('/publish', async (ctx) => {
  console.log('publish');
  console.log(ctx.request.body.message);
  clients.forEach(function(client){
   
    client(ctx.request.body.message);
  });
  
  clients = [];
  ctx.body = 'ok';
});

app.use(serve('./public'));
app.use(bodyParser());
app.use(router.routes());


app.listen(3000);