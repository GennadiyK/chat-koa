const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');

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
   
   ctx.res.on('close', () => {
     const err = new Error('Connection closed');
     err.code = 'ECONNRESET';
     reject(err);
   });
 });
  
 ctx.body = message;
});

router.post('/publish', async (ctx) => {
  // прочитать тело сообщения
  // подождать завершения чтения
  // отправить сообщение ожидающим клиентам
  
  console.log('publish');

  
  clients.forEach(function(client){
    client(ctx.request.body);
  });
});

app.use(bodyParser());
app.use(router.routes());


app.listen(3000);