
const User = require('../models/user.js');
const Question = require('../models/question.js');
const {
  createToken
} = require('../../libs/token');
class UserCtrl {
  /**
   * @apiGroup User
   * @api {POST} /user/signUp 注册用户
   * @apiDescription 注册用户
   * @apiParam {String} username  用户名
   * @apiParam {String} password  密码
   * @apiParam {Number} [age] 年龄
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": {
   *      "msg": "tom注册成功"
   *    }
   * }
   */
  async signUp (ctx) {
    ctx.verifyParams({
      username: 'string',
      password: 'string',
      age: {
        type: 'number',
        required: false
      }
    });
    const username = ctx.request.body.username;
    const password = User.generatePwd(ctx.request.body.password);
    let user = await User.findOne({
      username
    });
    if (!user) {
      let obj = Object.assign(ctx.request.body, {
        password
      });
      user = await User.create(obj);
    } else {
      throw new Error('用户已经被注册过');
    }
    ctx.success({
      msg: `${username}注册成功`
    });
  }

  /**
   * @apiGroup User
   * @api {POST} /user/signIn  用户登录
   * @apiDescription 用户登录
   * @apiParam {String} username  用户名
   * @apiParam {String} password  密码
   * @apiVersion 1.0.0
   * @apiSuccess {Object} token token
   * @apiSuccessExample {json} Success-Response:
   *{
   *   "code": 0,
   *   "data": {
   *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDA5OTFjZTE1M2IzNTU1YWE2MWI1MDMiLCJpYXQiOjE1NjEwODAyNzIsImV4cCI6MTU2MTE2NjY3Mn0.Uln-TF30Il_gUiy0lT-DVEV4crrBNmHTBJB4Wh2qttA",
   *       "userId": "5d0991ce153b3555aa61b503"
   *   }
   * }
   */
  async signIn (ctx) {
    ctx.verifyParams({
      username: 'string',
      password: 'string'
    });
    let password = ctx.request.body.password;
    let username = ctx.request.body.username;
    let user = await User.findOne({
      username
    }).select('+password');
    if (user) {
      let isExist = User.verifyPwd(password, user.password);
      if (isExist) {
        let token = await createToken(user._id);
        ctx.success({ token, userId: user._id });
      }
    } else {
      throw new Error(`当前用户:${username} 不存在`);
    }
  }

  /**
   * @apiGroup User
   * @api {PUT} /user/update/:id  修改用户信息
   * @apiHeader {String} Authorization 用户的token
   * @apiDescription 通过用户的唯一标识来修改用户信息
   * @apiParam  {String} [username] 用户名
   * @apiParam  {String} [password] 用户密码
   * @apiParam  {String} [avatarUrl] 头像
   * @apiParam  {String} [gender] 性别
   * @apiParam  {String} [headline] 一句话介绍
   * @apiParam  {array} [locations] 居住地话题的ObjectId
   * @apiParam  {array} [profession] 职业经历的ObjectId
   * @apiParam  {array} [educations] 学历的ObjectId
   * @apiParam  {array} [description] 描述
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *{
   *   "code": 0,
   *   "data": {
   *      "msg":"update successful"
   *    }
   *}
   */
  async update (ctx) {
    ctx.verifyParams({
      username: {
        type: 'string',
        required: false
      },
      password: {
        type: 'string',
        required: false
      },
      avatarUrl: {
        type: 'string',
        required: false
      },
      gender: {
        type: 'string',
        required: false
      },
      headline: {
        type: 'string',
        required: false
      },
      locations: {
        type: 'array',
        itemType: 'string',
        required: false
      },
      business: {
        type: 'string',
        required: false
      },
      profession: {
        type: 'array',
        itemType: 'object',
        required: false
      },
      educations: {
        type: 'array',
        itemType: 'object',
        required: false
      },
      description: {
        type: 'string',
        required: false
      }
    });

    let obj = ctx.request.body;
    if (obj.password) {
      obj.password = User.generatePwd(obj.password);
    }
    await User.findOneAndUpdate({
      _id: ctx.state.user.userId
    }, {
      $set: obj
    }, {
      new: true
    });
    ctx.success({ msg: `update successful` });
  }
  /**
   * @apiGroup User
   * @api {GET} /user/list  获取用户列表
   * @apiHeader {String} Authorization 用户的token
   * @apiDescription 获取用户列表
   * @apiParam  {String} [fileds] 需要查询的字段
   * @apiParam  {String} [pageNum=1] 当前的页码,默认第一页
   * @apiParam  {String} [pageSize=10] 每页显示的数量
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *{
   *   "code": 0,
   *   "data": [
   *       {
   *           "gender": "male",
   *           "_id": "5d0c330f7f8b17e3e49f871c",
   *           "username": "jack",
   *           "educations": [],
   *           "createdAt": "2019-06-21T01:29:51.590Z",
   *           "updatedAt": "2019-06-21T01:29:51.590Z"
   *       },
   *       {
   *           "gender": "male",
   *           "_id": "5d0c331b7f8b17e3e49f871d",
   *           "username": "lily",
   *           "educations": [],
   *           "createdAt": "2019-06-21T01:30:03.044Z",
   *           "updatedAt": "2019-06-21T01:30:03.044Z"
   *       }
   *   ]
   *}
   */
  async list (ctx) {
    let { fileds = '', pageNum = 1, pageSize = 10 } = ctx.query;
    pageNum = Math.max(+pageNum, 1) - 1;
    pageSize = Math.max(+pageSize, 1);
    let selectFields = fileds.split(';').filter(item => item).map(item => ' +' + item).join('');
    let userList = await User.find().skip(pageNum * pageSize).limit(pageSize).select(selectFields);
    ctx.success(userList);
  }
  /**
   * @apiGroup User
   * @api {GET} /user/:id  通过用户的Id获取用户信息
   * @apiDescription 通过用户的唯一标识来修改用户信息
   * @apiParam  {String} id 需要查询的字段
   * @apiParam  {String} [fileds] 需要查询的字段
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *{
   *   "code": 0,
   *   "data": [
   *       {
   *           "gender": "male",
   *           "_id": "5d0c330f7f8b17e3e49f871c",
   *           "username": "jack",
   *           "createdAt": "2019-06-21T01:29:51.590Z",
   *           "updatedAt": "2019-06-21T01:29:51.590Z"
   *       }
   *   ]
   * }
   */
  async findByUserId (ctx) {
    let { fileds = '' } = ctx.query;
    let selectFields = fileds.split(';').filter(item => item).map(item => ' +' + item).join('');
    let populateStr = fileds.split(';').filter(item => item).map(item => {
      if (item === 'profession') {
        return 'profession.company profession.position';
      } else if (item === 'educations') {
        return 'educations.scholl educations.major';
      } else {
        return item;
      }
    }).join(' ');
    let userList = await User.find({ _id: ctx.params.id }).select(selectFields).populate(populateStr);
    ctx.success(userList);
  }
  /**
   * @apiGroup User
   * @api {PUT} /user/:id/following  关注别人
   * @apiHeader {String} Authorization 用户的token
   * @apiDescription 关注别人
   * @apiParam  {String} id 关注人的用户id
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": {
   *       "msg": "关注成功"
   *   }
   * }
   */
  async following (ctx) {
    let user = await User.findOne({ _id: ctx.state.user.userId }).select('+following');
    let isExist = user.following.map(item => item.toString()).includes(ctx.params.id);
    if (!isExist) {
      user.following.push(ctx.params.id);
      await user.save();
    }
    ctx.success({ msg: '关注成功' });
  }
  /**
   * @apiGroup User
   * @api {GET} /user/:id/followLists  获取关注的列表
   * @apiDescription 获取关注的列表
   * @apiParam  {String} id 查询哪个人的userId
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
  async followLists (ctx) {
    let lists = await User.find({ following: ctx.params.id });
    ctx.success(lists);
  }
  /**
   * @apiGroup User
   * @api {DELETE} /user/:id/unfllowing  取消关注别人
   * @apiHeader {String} Authorization 用户的token
   * @apiDescription 取消关注别人
   * @apiParam  {String} id 关注人的用户id
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *   {
   *   "code": 0,
   *   "data": {
   *       "msg": "取消关注成功"
   *   }
   * }
   */
  async unfollow (ctx) {
    let user = await User.findById(ctx.state.user.userId).select('+following');
    let index = user.following.map(item => item.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      user.following.splice(index, 1);
      await user.save();
    }
    ctx.success({
      msg: '取消关注成功'
    });
  }
  /**
   * @apiGroup User
   * @api {PUT} /user/:id/followTopics  关注话题
   * @apiHeader {String} Authorization 用户的token
   * @apiDescription 关注话题
   * @apiParam  {String} id 话题的id
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": {
   *       "msg": "关注成功"
   *   }
   * }
   */
  async followTopics (ctx) {
    let user = await User.findById(ctx.state.user.userId).select('+followTopics');
    let index = user.followTopics.map(item => item.toString()).indexOf(ctx.params.id);
    if (index === -1) {
      user.followTopics.push(ctx.params.id);
      await user.save();
    }
    ctx.success({
      msg: '关注成功'
    });
  }
  /**
   * @apiGroup User
   * @api {DELETE} /user/:id/unfllowTopics  取消关注话题
   * @apiHeader {String} Authorization 用户的token
   * @apiDescription 取消关注话题
   * @apiParam  {String} id 话题id
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *   {
   *   "code": 0,
   *   "data": {
   *       "msg": "取消关注成功"
   *   }
   * }
   */
  async unfollowTopics (ctx) {
    let user = await User.findById(ctx.state.user.userId).select('+followTopics');
    let index = user.followTopics.map(item => item.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      user.followTopics.splice(index, 1);
      await user.save();
    }
    ctx.success({
      msg: '取消关注成功'
    });
  }
  /**
   * @apiGroup User
   * @api {GET} /user/:id/myQuestionLists  获取我提的问题列表
   * @apiHeader {String} Authorization 用户的token
   * @apiDescription 获取我提的问题列表
   * @apiParam  {String} id 话题id
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *  {
   *    "code": 0,
   *    "data": [
   *        {
   *            "topicLists": [
   *                {
   *                    "_id": "5d0cc82397f2e00ffb8d2ba0",
   *                    "name": "互联网",
   *                    "createdAt": "2019-06-21T12:05:55.942Z",
   *                    "updatedAt": "2019-06-21T12:05:55.942Z"
   *                }
   *            ],
   *            "_id": "5d0da7124de1325a9f65ae23",
   *            "title": "koa 怎么学",
   *            "description": "koa是nodejs的一个web框架",
   *            "createdAt": "2019-06-22T03:57:06.519Z",
   *            "updatedAt": "2019-06-22T05:27:47.318Z"
   *        }
   *    ]
   * }
   */
  async getMyQuestionLists (ctx) {
    let qLists = await Question.find({ questioner: ctx.state.user.userId }).populate('topicLists');
    ctx.success(qLists);
  }
  /**
   * @apiGroup User
   * @api {PUT} /user/:anwserId/like 点赞
   * @apiHeader {String} Authorization 用户的token
   * @apiDescription 点赞
   * @apiParam  {String} anwserId 答案id
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *  http status 204
   */
  async likeAnwser (ctx, next) {
    let user = await User.findById(ctx.state.user.userId).select('+likeCollections');
    let index = user.likeCollections.map(item => item.toString()).indexOf(ctx.params.anwserId);
    if (index === -1) {
      user.likeCollections.push(ctx.params.anwserId);
      await user.save();
    }
    ctx.status = 204;
    await next();
  }
  /**
   * @apiGroup User
   * @api {PUT} /user/:anwserId/cancelLikeAnwser 取消点赞
   * @apiHeader {String} Authorization 用户的token
   * @apiDescription 取消点赞
   * @apiParam  {String} anwserId 答案id
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *    http status 204
   */
  async cancelLikeAnwser (ctx) {
    let user = await User.findById(ctx.state.user.userId).select('+likeCollections');
    let index = user.likeCollections.map(item => item.toString()).indexOf(ctx.params.anwserId);
    if (index > -1) {
      user.likeCollections.splice(index, 1);
      await user.save();
    }
    ctx.status = 204;
  }
  /**
   * @apiGroup User
   * @api {PUT} /user/:anwserId/dislike 踩
   * @apiHeader {String} Authorization 用户的token
   * @apiDescription 踩
   * @apiParam  {String} anwserId 答案id
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *    http status 204
   */
  async dislikeAnwser (ctx, next) {
    let user = await User.findById(ctx.state.user.userId).select('+disLikeCollections');
    let index = user.disLikeCollections.map(item => item.toString()).indexOf(ctx.params.anwserId);
    if (index === -1) {
      user.disLikeCollections.push(ctx.params.anwserId);
      await user.save();
    }
    ctx.status = 204;
    await next();
  }
  /**
   * @apiGroup User
   * @api {PUT} /user/:anwserId/cancelDislikeAnwser 取消踩
   * @apiHeader {String} Authorization 用户的token
   * @apiDescription 取消踩
   * @apiParam  {String} anwserId 答案id
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccessExample {json} Success-Response:
   *    http status 204
   */
  async cancelDislikeAnwser (ctx) {
    let user = await User.findById(ctx.state.user.userId).select('+disLikeCollections');
    let index = user.disLikeCollections.map(item => item.toString()).indexOf(ctx.params.anwserId);
    if (index > -1) {
      user.disLikeCollections.splice(index, 1);
      await user.save();
    }
    ctx.status = 204;
  }
  async checkUserIsExist (ctx, next) {
    let u = await User.findById(ctx.params.id);
    if (u) {
      await next();
    } else {
      ctx.success({ msg: `用户不存在` });
    }
  }
}

module.exports = new UserCtrl();
