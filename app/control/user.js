const bcryptjs = require('bcryptjs');
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
    const password = ctx.request.body.password;
    let user = await Users.findOne({
      username
    });
    if (!user) {
      let salt = bcryptjs.genSaltSync(10);
      let pwd = bcryptjs.hashSync(password, salt);
      let obj = Object.assign(ctx.request.body, {
        password: pwd
      });
      user = await Users.create(obj);
    } else {
      ctx.throw(406, '用户已经注册过');
    }
    ctx.body = user;
  }

  /**
   * @apiGroup User
   * @api {POST} /user/signIn  用户登录
   * @apiDescription 用户登录
   * @apiParam {String} username  用户名
   * @apiParam {String} password  密码
   * @apiVersion 1.0.0
   */
  async signIn (ctx) {
    ctx.verifyParams({
      username: 'string',
      paassword: 'string'
    });
    let password = ctx.request.password;
    let username = ctx.request.username;
    let user = await Users.findOne({
      username
    });
    const isExist = bcryptjs.compareSync(password, user.password);
    if (isExist) {
      ctx.body = {
        token: createToken(user._id)
      };
    }
  }

  /**
   * @apiGroup User
   * @api {PUT} /user/update/:id  修改用户信息
   * @apiDescription 通过用户的唯一标识来修改用户信息
   * @apiParam  {Number} id 用户唯一标识
   * @apiParam  {String} [username] 用户名
   * @apiParam  {String} [password] 用户密码
   * @apiParam  {Number} [age] 年龄
   * @apiVersion 1.0.0
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

    await Users.findOneAndUpdate({
      _id: ctx.params.id
    }, {
      $set: ctx.request.body
    }, {
      new: true
    });
    ctx.body = ctx.request.body;
  }
  async checkIsOwner (ctx, next) {
    if (ctx.state.user._id === ctx.params.id) {
      await next();
    } else {
      ctx.throw(403, '您没有权限操作');
    }
  }
}

module.exports = new User();
