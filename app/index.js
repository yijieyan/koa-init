const {
  port
} = require('../config');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const { dbConnect } = require('../libs/db.js');
const error = require('../middlewares/error.js');
const bodyParser = require('koa-bodyparser');
const parameter = require('koa-parameter');
const serve = require('koa-static');
const logger = require('../middlewares/logger.js');
const routeMapping = require('./router/index');

process.env.dataDir = path.join(__dirname, '../');
dbConnect();

if (process.env.NODE_ENV === 'development') {
  app.use(serve(path.join(__dirname, './public/apidoc')));
}

app.use(bodyParser());
app.use(logger);
app.use(error);
parameter(app);
routeMapping(app);

app.listen(port, () => {
  console.log(`app listen http://localhost:${port}`);
});
