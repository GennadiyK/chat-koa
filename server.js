const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const url = require('url');
const querystring = require('querystring');
let clients = [];


router.get('/', async (ctx) => {
  ctx.body = 'main page 1';
});

router.get('/subscribe', async (ctx) => {
  // subribe - подписаться на событие
  // 1. принять
  // 2. хранить/запомнить
  // 3. ответить при появлении события на которое клиент подписан
  console.log('subribe');
 let message = await new Promise((resolve, reject) => {
   clients.push(resolve);
 });

 ctx.body = message;
});

router.get('/publish', async (ctx) => {
  // прочитать тело сообщения
  // подождать завершения чтения
  // отправить сообщение ожидающим клиентам
  console.log('publish');
  let queryUrl = url.parse(ctx.request.url).query;
  let message = querystring.parse(queryUrl).message;
 

  let _emit = ctx.req.emit;
  ctx.req.emit = function(event, ...args) {
    console.log(event);
    _emit.call(ctx.req, event, ...args);
  };
  
  
  clients.forEach(function(client){
     client(message);
  });
});

app.use(router.routes());

app.listen(3000);