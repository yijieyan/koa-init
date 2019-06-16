const Router = require('koa-router');
const {
  addUser,
  getUserList,
  updateUser,
  deleteUser
} = require('../../control/user');
const router = new Router({
  prefix: '/v1/user'
});

router.post('/addUser', addUser);
router.get('/getUserList', getUserList);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
module.exports = router;
