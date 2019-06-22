const Router = require('koa-router');

const { create, list, findById, update, delete: del, checkQuestionIsExist, checkQuestionerIsRight } = require('../../control/question.js');
const { authUser } = require('../../../middlewares/auth.js');

const router = new Router({
  prefix: '/v1/question'
});

router.post('/create', authUser, create);
router.get('/list', authUser, list);
router.put('/:id', authUser, checkQuestionIsExist, checkQuestionerIsRight, update);
router.delete('/:id', authUser, checkQuestionIsExist, checkQuestionerIsRight, del);
router.get('/:id', findById);
module.exports = router;
