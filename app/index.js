const {
  port
} = require('../config');

const Koa = require('koa');
const app = new Koa();
const error = require('koa-json-error');
const bodyParser = require('koa-bodyparser');
const parameter = require('koa-parameter');
const routeMapping = require('./router/index');

app.use(bodyParser());
parameter(app);
app.use(error({
  postFormat: (e, {
    stack,
    ...error
  }) => process.env.NODE_ENV === 'production' ? error : {
    stack,
    ...error
  }
}));
routeMapping(app);
app.listen(port, () => {
  console.log(`app listen ${port}`);
});
