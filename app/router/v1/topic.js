const Router = require('koa-router');
const {
  authUser
} = require('../../../middlewares/auth');
const router = new Router({
  prefix: '/v1/topic'
});
const {
  create, list, checkTopicIsExist, findById, update, followTopicLists
} = require('../../control/topic.js');

router.post('/create', authUser, create);
router.get('/list', authUser, list);
router.put('/:id', authUser, checkTopicIsExist, update);
router.get('/:id', authUser, checkTopicIsExist, findById);
router.get('/:id/followTopicsLists', authUser, checkTopicIsExist, followTopicLists);

module.exports = router;
