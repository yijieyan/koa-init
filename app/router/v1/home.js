const Router = require('koa-router');
const router = new Router({
  prefix: '/v1'
});
const {
  index
} = require('../../control/home');

router.get('/', index);

module.exports = router;
