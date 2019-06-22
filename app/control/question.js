const Question = require('../models/question.js');

class QuestionCtrl {
  /**
   * @apiGroup Question
   * @api {POST} /question/create 创建问题
   * @apiDescription 创建问题
   * @apiHeader {String} Authorization 用户的token
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiParam {String} title  问题名称
   * @apiParam {String} [description]  问题描述
   * @apiParam {Array} [topicLists] 问题的话题标签列表
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *{
   *   "code": 0,
   *   "data": {
   *       "msg": "新增问题成功"
   *   }
   *}
   */
  async create (ctx) {
    ctx.verifyParams({
      title: 'string',
      description: { type: 'string', required: false },
      topicLists: { type: 'array', required: false }
    });

    await Question.create({ ...ctx.request.body, questioner: ctx.state.user.userId });
    ctx.success({
      msg: '新增问题成功'
    });
  }
  /**
   * @apiGroup Question
   * @api {GET} /question/list 获取问题列表
   * @apiDescription 获取问题列表
   * @apiParam {Number} [pageNum=1]  当前页
   * @apiParam {Number} [pageSize=10] 每页的数据
   * @apiParam {String} [q] 模糊搜索
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": {
   *       "topicLists": [
   *           {
   *               "_id": "5d0cc82397f2e00ffb8d2ba0",
   *               "name": "互联网",
   *               "createdAt": "2019-06-21T12:05:55.942Z",
   *               "updatedAt": "2019-06-21T12:05:55.942Z"
   *           }
   *       ],
   *       "_id": "5d0da7124de1325a9f65ae23",
   *       "title": "koa 怎么学",
   *       "description": "koa是nodejs的一个web框架",
   *       "createdAt": "2019-06-22T03:57:06.519Z",
   *       "updatedAt": "2019-06-22T05:27:47.318Z"
   *   }
   * }
   */
  async list (ctx) {
    let { pageNum = 1, pageSize = 10, q = '' } = ctx.query;
    pageNum = Math.max(+pageNum, 1) - 1;
    pageSize = Math.max(+pageSize, 1);
    let list = await Question.find({ $or: [{ title: new RegExp(q) }, { description: new RegExp(q) }] }).skip(pageNum * pageSize).limit(pageSize).populate('topicLists');
    ctx.success(list);
  }
  /**
   * @apiGroup Question
   * @api {GET} /question/:id 通过问题id获取问题
   * @apiDescription 通过问题id获取问题
   * @apiParam {String} id  问题id
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": {
   *       "topicLists": [
   *           {
   *               "_id": "5d0cc82397f2e00ffb8d2ba0",
   *               "name": "互联网",
   *               "createdAt": "2019-06-21T12:05:55.942Z",
   *               "updatedAt": "2019-06-21T12:05:55.942Z"
   *           }
   *       ],
   *       "_id": "5d0da7124de1325a9f65ae23",
   *       "title": "koa 怎么学",
   *       "description": "koa是nodejs的一个web框架",
   *       "createdAt": "2019-06-22T03:57:06.519Z",
   *       "updatedAt": "2019-06-22T05:27:47.318Z"
   *   }
   * }
   */
  async findById (ctx) {
    let question = await Question.findById(ctx.params.id).populate('topicLists');
    ctx.success(question);
  }
  /**
   * @apiGroup Question
   * @api {PUT} /question/:id 通过问题id更新问题
   * @apiDescription 通过问题id更新问题
   * @apiHeader {String} Authorization 用户的token
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiParam {String} id  问题id
   * @apiParam {String} title  问题名称
   * @apiParam {String} [description]  问题描述
   * @apiParam {Array} [topicLists]  问题上的话题列表
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": {
   *       "topicLists": [
   *           "5d0cc82397f2e00ffb8d2ba0"
   *       ],
   *       "_id": "5d0da677c4256c5a241c016b",
   *       "title": "tom的家在哪？",
   *       "description": "tom家住在哪里",
   *       "createdAt": "2019-06-22T03:54:31.158Z",
   *       "updatedAt": "2019-06-22T05:28:23.601Z"
   *   }
   * }
   */
  async update (ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
      questioner: { type: 'string', required: false },
      topicLists: { type: 'array', required: false }
    });
    let question = await Question.update({ _id: ctx.params.id, questioner: ctx.state.user.userId }, { $set: ctx.request.body });
    ctx.success(question);
  }
  /**
   * @apiGroup Question
   * @api {DELETE} /question/:id 通过问题id删除问题
   * @apiDescription 通过问题id删除问题
   * @apiHeader {String} Authorization 用户的token
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiParam {String} id  问题id
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": {
   *       "msg": "删除问题成功"
   *   }
   * }
   */
  async delete (ctx) {
    await Question.findByIdAndRemove(ctx.params.id);
    ctx.success({
      msg: '删除问题成功'
    });
  }
  async checkQuestionIsExist (ctx, next) {
    let q = await Question.findById(ctx.params.id);
    if (q) {
      await next();
    } else {
      ctx.success({
        msg: '问题不存在'
      }, -1);
    }
  }
  async checkQuestionerIsRight (ctx, next) {
    let q = await Question.findOne({ questioner: ctx.state.user.userId });
    if (q) {
      await next();
    } else {
      ctx.success({ msg: '没有权限' }, -1);
    }
  }
}

module.exports = new QuestionCtrl();
