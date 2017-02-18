const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
let clients = [];


router.get('/', async (ctx) => {
  ctx.body = 'main page 1';
});

router.get('/subscribe', async (ctx) => {
  await new Promise((resolve, reject) => {
    clients.push(resolve);
  })
});

router.get('/publish', async (ctx) => {
  clients.forEach((client) =>{
      client();
  });
  console.log(clients);
});

app.use(router.routes());

app.listen(3000);