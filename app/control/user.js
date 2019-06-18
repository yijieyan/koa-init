
const Users = require('../models/user.js');
const {
  createToken
} = require('../../libs/token');
class User {
  /**
   * @apiGroup User
   * @api {POST} /user/signUp 注册用户
   * @apiDescription 注册用户
   * @apiParam {String} username  用户名
   * @apiParam {String} password  密码
   * @apiParam {Number} [age=18] 年龄
   * @apiVersion 1.0.0
   * @apiSuccess {Object} username 用户名
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "code": 0,
   *   "data": {
   *      "_id": "5d08b9fb05164c2a7b858abc",
   *      "username": "tom",
   *      "createdAt": "2019-06-18T10:16:27.590Z",
   *      "updatedAt": "2019-06-18T10:16:27.590Z"
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
    const password = Users.generatePwd(ctx.request.body.password);
    let user = await Users.findOne({
      username
    });
    if (!user) {
      let obj = Object.assign(ctx.request.body, {
        password
      });
      user = (await Users.create(obj)).toJSON();
      delete user.password;
    } else {
      throw new Error('用户已经被注册过');
    }
    ctx.success(user);
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
   * {
   *   "code": 0,
   *   "data": {
   *      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDA4YjlmYjA1MTY0YzJhN2I4NThhYmMiLCJpYXQiOjE1NjA4NTMxMTMsImV4cCI6MTU2MDkzOTUxM30.rMqivtXdd1ZM3TOQrwoy-E6uyUP5TBN2MsSD7WS46BI"
   *    }
   * }
   */
  async signIn (ctx) {
    ctx.verifyParams({
      username: 'string',
      password: 'string'
    });
    let password = ctx.request.body.password;
    let username = ctx.request.body.username;
    let user = await Users.findOne({
      username
    });
    if (user) {
      let isExist = Users.verifyPwd(password, user.password);
      if (isExist) {
        let token = await createToken(user._id);
        ctx.success({ token });
      }
    } else {
      throw new Error(`当前用户:${username} 不存在`);
    }
  }

  /**
   * @apiGroup User
   * @api {PUT} /user/update/:id  修改用户信息
   * @apiHeader {String} Authorization 用户的token
   * @apiParam  {String} id 用户唯一标识
   * @apiDescription 通过用户的唯一标识来修改用户信息
   * @apiParam  {String} [username] 用户名
   * @apiParam  {String} [password] 用户密码
   * @apiParam  {Number} [age] 年龄
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccess {Object} token token
   * @apiSuccessExample {json} Success-Response:
   *{
   *   "code": 0,
   *   "data": {
   *       "id": "",
   *       "username": "jack"
   *   }
   *}
   */
  async update (ctx) {
    ctx.verifyParams({
      id: 'string',
      username: {
        type: 'string',
        required: false
      },
      password: {
        type: 'string',
        required: false
      },
      age: {
        type: 'number',
        required: false
      }
    });

    let obj = ctx.request.body;
    obj.password = Users.generatePwd(obj.password);
    await Users.findOneAndUpdate({
      _id: ctx.params.id
    }, {
      $set: obj
    }, {
      new: true
    });
    delete obj.password;
    ctx.success(obj);
  }
  async checkIsOwner (ctx, next) {
    if (ctx.state.user.userId === ctx.params.id) {
      await next();
    } else {
      ctx.throw(403, '没有权限');
    }
  }
}

module.exports = new User();
