const Router = require('koa-router');
const {
  signUp,
  signIn,
  update,
  list,
  findByUserId,
  checkUserIsExist,
  following,
  followLists,
  unfollow,
  followTopics,
  unfollowTopics,
  getMyQuestionLists,
  likeAnwser,
  cancelLikeAnwser,
  dislikeAnwser,
  cancelDislikeAnwser
} = require('../../control/user');

const {
  authUser
} = require('../../../middlewares/auth');

const { checkTopicIsExist } = require('../../control/topic.js');
const router = new Router({
  prefix: '/v1/user'
});

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.put('/update', authUser, update);
router.get('/list', authUser, list);
router.get('/:id', findByUserId);
router.put('/:id/following', authUser, checkUserIsExist, following);
router.get('/:id/followLists', followLists);
router.delete('/:id/unfollowing', authUser, checkUserIsExist, unfollow);
router.put('/:id/followTopics', authUser, checkTopicIsExist, followTopics);
router.delete('/:id/unfollowTopics', authUser, checkTopicIsExist, unfollowTopics);
router.get('/:id/myQuestionLists', authUser, getMyQuestionLists);
router.put('/:anwserId/like', authUser, likeAnwser, cancelDislikeAnwser);
router.put('/:anwserId/cancelLikeAnwser', authUser, cancelLikeAnwser);
router.put('/:anwserId/dislike', authUser, dislikeAnwser, cancelLikeAnwser);
router.put('/:anwserId/cancelDislikeAnwser', authUser, cancelDislikeAnwser);
module.exports = router;
