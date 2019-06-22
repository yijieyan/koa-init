const Topic = require('../models/topic.js');
let User = require('../models/user.js');

class TopicCtrl {
  /**
   * @apiGroup Topic
   * @api {POST} /topic/create 创建话题
   * @apiDescription 创建话题
   * @apiHeader {String} Authorization 用户的token
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiParam {String} name  话题名
   * @apiParam {String} [avatarUrl]  话题头像
   * @apiParam {Number} [introduction] 话题介绍
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *{
   *   "code": 0,
   *   "data": {
   *       "msg": "创建话题成功"
   *   }
   *}
   */
  async create (ctx) {
    ctx.verifyParams({
      name: { type: 'string' },
      avatarUrl: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    });

    await Topic.create(ctx.request.body);
    ctx.success({ msg: `创建话题成功` });
  }
  /**
   * @apiGroup Topic
   * @api {GET} /topic/list 获取话题列表
   * @apiDescription 获取话题列表
   * @apiParam {Number} [pageNum=1]  当前页
   * @apiParam {Number} [pageSize=10] 每页的数据
   * @apiParam {String} [q] 模糊搜索
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": [
   *       {
   *           "_id": "5d0cb4c373abbb7baa80d5af",
   *           "name": "生活",
   *           "createdAt": "2019-06-21T10:43:15.017Z",
   *           "updatedAt": "2019-06-21T10:43:15.017Z"
   *       }
   *   ]
   * }
   */
  async list (ctx) {
    let { pageNum = 1, pageSize = 10, q } = ctx.query;
    pageNum = Math.max(+pageNum, 1) - 1;
    pageSize = Math.max(+pageSize, 1);
    let topics = await Topic.find({ name: new RegExp(q) }).skip(pageNum * pageSize).limit(pageSize);
    ctx.success(topics);
  }
  /**
   * @apiGroup Topic
   * @api {GET} /topic/:id 通过话题id获取话题
   * @apiDescription 通过话题id获取话题
   * @apiParam {String} id  话题id
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": [
   *       {
   *           "_id": "5d0cb4c373abbb7baa80d5af",
   *           "name": "生活",
   *           "createdAt": "2019-06-21T10:43:15.017Z",
   *           "updatedAt": "2019-06-21T10:43:15.017Z"
   *       }
   *   ]
   * }
   */
  async findById (ctx) {
    let topic = await Topic.findById(ctx.params.id);
    ctx.success(topic);
  }
  /**
   * @apiGroup Topic
   * @api {PUT} /topic/:id 通过话题id更新话题内容
   * @apiDescription 通过话题id更新话题内容
   * @apiHeader {String} Authorization 用户的token
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiParam {String} id  话题id
   * @apiParam {String} name  话题名
   * @apiParam {String} [avatarUrl]  话题头像
   * @apiParam {String} [introduction]  话题简介
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *{
   *   "code": 0,
   *   "data": {
   *       "_id": "5d0cb4c373abbb7baa80d5af",
   *       "name": "科技圈",
   *       "createdAt": "2019-06-21T10:43:15.017Z",
   *       "updatedAt": "2019-06-21T11:12:40.985Z",
   *       "avatarUrl": "uploads/2019-06/e14243c0bae83ccb49767a494277b2bf"
   *   }
   * }
   */
  async update (ctx) {
    ctx.verifyParams({
      name: 'string',
      avatarUrl: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    });

    let t = await Topic.findOneAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    ctx.success(t);
  }
  /**
   * @apiGroup Topic
   * @api {GET} /topic/:id/followTopicsLists  获取关注某个话题的列表
   * @apiDescription 获取关注某个话题的列表
   * @apiParam  {String} id 话题的id
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "code": 0,
   *    "data": {
   *        "gender": "male",
   *        "following": [
   *            {
   *                "gender": "male",
   *                "_id": "5d0ca338643b65687f36a2d9",
   *                "username": "admin",
   *                "createdAt": "2019-06-21T09:28:24.967Z",
   *                "updatedAt": "2019-06-21T09:28:24.967Z"
   *            }
   *        ],
   *        "_id": "5d0ca335643b65687f36a2d8",
   *        "username": "yijie",
   *        "createdAt": "2019-06-21T09:28:21.049Z",
   *        "updatedAt": "2019-06-21T09:28:41.747Z"
   *    }
   *  }
   */
  async followTopicLists (ctx) {
    let user = await User.find({ followTopics: ctx.params.id });
    ctx.success(user);
  }
  async checkTopicIsExist (ctx, next) {
    let t = await Topic.findById(ctx.params.id);
    if (t) {
      await next();
    } else {
      ctx.success({ msg: `话题id:${ctx.params.id}不存在` }, -1);
    }
  }
}

module.exports = new TopicCtrl();
