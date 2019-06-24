const Router = require('koa-router');
const { authUser } = require('../../../middlewares/auth.js');
const { create, list, update, delete: del, findById, checkIdIsQuestion, checkAnwserIsExist, getListByQuestionId, getLikeCollections, getDisLikeCollectioins } = require('../../control/anwser.js');

const router = new Router({
  prefix: '/v1/anwser'
});

router.post('/create', authUser, create);
router.get('/list', list);
router.get('/getListByQuestionId', getListByQuestionId);
router.put('/:id/question/:questionId', authUser, checkAnwserIsExist, checkIdIsQuestion, update);
router.delete('/:id', authUser, checkAnwserIsExist, del);
router.get('/:id', findById);
router.get('/:id/like', getLikeCollections);
router.get('/:id/dislike', getDisLikeCollectioins);

module.exports = router;
