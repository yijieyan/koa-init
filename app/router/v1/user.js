const Router = require('koa-router');
const {
  signUp,
  signIn,
  update,
  checkIsOwner
} = require('../../control/user');

const {
  authUser
} = require('../../../middlewares/auth');
const router = new Router({
  prefix: '/v1/user'
});

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.put('/update/:id', authUser, checkIsOwner, update);
module.exports = router;
