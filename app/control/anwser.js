const Anwser = require('../models/anwser.js');
const User = require('../models/user.js');

class AnwserCtrl {
  /**
   * @apiGroup Anwser
   * @api {POST} /anwser/create 创建答案
   * @apiDescription 创建答案
   * @apiHeader {String} Authorization 用户的token
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiParam {String} content  问题名称
   * @apiParam {String} questionId  问题的id
   * @apiParam {String} anwser 回答的人
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *   {
   *     "code": 0,
   *     "data": {
   *         "msg": "回答成功"
   *     }
   *   }
   */
  async create (ctx) {
    ctx.verifyParams({
      content: 'string',
      questionId: 'string',
      anwser: 'string'
    });
    await Anwser.create(ctx.request.body);
    ctx.success({
      msg: '回答成功'
    });
  }
  /**
   * @apiGroup Anwser
   * @api {GET} /anwser/list 获取答案列表
   * @apiDescription 获取答案列表
   * @apiParam {Number} [pageNum=1]  当前页
   * @apiParam {Number} [pageSize=10] 每页的数据
   * @apiParam {String} [q] 模糊搜索
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": [
   *       {
   *           "_id": "5d0de6ff3b7617900a729abc",
   *           "content": "koa 需要有\b一些js基础和es6的基础",
   *           "questionId": "5d0da7124de1325a9f65ae23",
   *           "createdAt": "2019-06-22T08:29:51.797Z",
   *           "updatedAt": "2019-06-22T08:29:51.797Z"
   *       }
   *   ]
   * }
   */
  async list (ctx) {
    let { pagenNum = 1, pageSize = 10, q = '' } = ctx.query;
    pagenNum = Math.max(+pagenNum, 1) - 1;
    pageSize = Math.max(+pageSize, 1);
    let list = await Anwser.find({ content: new RegExp(q) }).skip(pagenNum * pageSize).limit(pageSize);
    ctx.success(list);
  }
  /**
   * @apiGroup Anwser
   * @api {GET} /anwser/:id 通过答案id获取答案详情
   * @apiDescription 通过答案id获取答案详情
   * @apiParam {String} id  问题id
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *   {
   *     "code": 0,
   *     "data": {
   *         "_id": "5d0de6ff3b7617900a729abc",
   *         "content": "koa 需要有\b一些js基础和es6的基础",
   *         "questionId": "5d0da7124de1325a9f65ae23",
   *         "createdAt": "2019-06-22T08:29:51.797Z",
   *         "updatedAt": "2019-06-22T08:29:51.797Z"
   *     }
   *   }
   */
  async findById (ctx) {
    let anwser = await Anwser.findById(ctx.params.id);
    ctx.success(anwser || []);
  }
  /**
   * @apiGroup Anwser
   * @api {PUT} /anwser/:id/question/:questionId 通过答案id更新答案
   * @apiDescription 通过答案id更新答案
   * @apiHeader {String} Authorization 用户的token
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiParam {String} id  答案id
   * @apiParam {String} questionId  问题id
   * @apiParam {String} [content]  答案
   * @apiParam {String} [questionId]  问题id
   * @apiParam {Array} [anwser]  回答者的id
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *   {
   *     "code": 0,
   *     "data": {
   *         "_id": "5d0de6ff3b7617900a729abc",
   *         "content": "需要会一些数据库储备知识",
   *         "questionId": "5d0da7124de1325a9f65ae23",
   *         "createdAt": "2019-06-22T08:29:51.797Z",
   *         "updatedAt": "2019-06-22T09:09:28.018Z"
   *     }
   *  }
   */
  async update (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false },
      questionId: { type: 'string', required: false },
      anwser: { type: 'string', required: false }
    });

    let anwser = await Anwser.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });
    ctx.success(anwser);
  }
  /**
   * @apiGroup Anwser
   * @api {DELETE} /anwser/:id 通过答案id删除答案
   * @apiDescription 通过答案id删除答案
   * @apiHeader {String} Authorization 用户的token
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiParam {String} id  问题id
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *   {
   *       "code": 0,
   *       "data": {
   *           "msg": "删除答案成功"
   *       }
   *   }
   */
  async delete (ctx) {
    await Anwser.findByIdAndRemove(ctx.params.id);
    ctx.success({
      msg: '删除答案成功'
    });
  }
  /**
   * @apiGroup Anwser
   * @api {GET} /anwser/getListByQuestionId 通过问题id获取答案
   * @apiDescription 通过问题id获取答案
   * @apiHeader {String} Authorization 用户的token
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiParam {String} questionId  问题id
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": [
   *       {
   *           "_id": "5d0de6ff3b7617900a729abc",
   *           "content": "koa 需要有\b一些js基础和es6的基础",
   *           "questionId": "5d0da7124de1325a9f65ae23",
   *           "createdAt": "2019-06-22T08:29:51.797Z",
   *           "updatedAt": "2019-06-22T08:29:51.797Z"
   *       }
   *   ]
   * }
   */
  async getListByQuestionId (ctx) {
    let aLists = await Anwser.find({ questionId: ctx.query.questionId });
    ctx.success(aLists);
  }
  /**
   * @apiGroup Anwser
   * @api {GET} /anwser/:id/like 通过答案id获取点赞该答案的人员列表
   * @apiDescription 通过答案id获取点赞该答案的人员列表
   * @apiHeader {String} Authorization 用户的token
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiParam {String} questionId  答案id
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": [
   *       {
   *           "gender": "male",
   *           "_id": "5d0ca32e643b65687f36a2d6",
   *           "username": "jack",
   *           "createdAt": "2019-06-21T09:28:14.600Z",
   *           "updatedAt": "2019-06-24T06:39:53.592Z"
   *       }
   *   ]
   * }
   */
  async getLikeCollections (ctx) {
    let user = await User.find({ likeCollections: ctx.params.id });
    ctx.success(user);
  }
  /**
   * @apiGroup Anwser
   * @api {GET} /anwser/:id/dislike 通过答案id获取踩该答案的人员列表
   * @apiDescription 通过答案id获取踩该答案的人员列表
   * @apiHeader {String} Authorization 用户的token
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiParam {String} questionId  答案id
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "code": 0,
   *     "data": [
   *         {
   *             "gender": "male",
   *             "_id": "5d0ca32e643b65687f36a2d6",
   *             "username": "jack",
   *             "createdAt": "2019-06-21T09:28:14.600Z",
   *             "updatedAt": "2019-06-24T06:43:40.835Z"
   *         }
   *     ]
   * }
   */
  async getDisLikeCollectioins (ctx) {
    let user = await User.find({ disLikeCollections: ctx.params.id });
    ctx.success(user);
  }
  async checkIdIsQuestion (ctx, next) {
    let isExist = await Anwser.findOne({ questionId: ctx.params.questionId });
    if (isExist) {
      await next();
    } else {
      ctx.success({ msg: `该${ctx.params.questionId}不是当前答案的问题` }, -1);
    }
  }
  async checkAnwserIsExist (ctx, next) {
    let anwser = await Anwser.findById(ctx.params.id);
    if (anwser) {
      await next();
    } else {
      ctx.success({ msg: `该答案id:${ctx.params.id}不存在` });
    }
  }
}

module.exports = new AnwserCtrl();
