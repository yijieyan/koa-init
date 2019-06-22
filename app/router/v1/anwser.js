const Router = require('koa-router');
const { authUser } = require('../../../middlewares/auth.js');
const { create, list, update, delete: del, findById, checkIdIsQuestion, checkAnwserIsExist, getListByQuestionId } = require('../../control/anwser.js');

const router = new Router({
  prefix: '/v1/anwser'
});

router.post('/create', authUser, create);
router.get('/list', list);
router.get('/getListByQuestionId', getListByQuestionId);
router.put('/:id/question/:questionId', authUser, checkAnwserIsExist, checkIdIsQuestion, update);
router.delete('/:id', authUser, checkAnwserIsExist, del);
router.get('/:id', findById);

module.exports = router;
