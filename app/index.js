const {
  port
} = require('../config');

const Koa = require('koa');
const app = new Koa();
const { dbConnect } = require('../libs/db.js');
const error = require('koa-json-error');
const bodyParser = require('koa-bodyparser');
const parameter = require('koa-parameter');
const serve = require('koa-static');
const path = require('path');
const routeMapping = require('./router/index');

dbConnect();
if (process.env.NODE_ENV === 'development') {
  app.use(serve(path.join(__dirname, './public/apidoc')));
}

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
