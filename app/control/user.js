const Users = require('../models/user.js');
class User {
  /**
    * @apiGroup User
    * @api {POST} /user/addUser 新增用户
    * @apiDescription 新增用户
    * @apiParam {String} username  用户名
    * @apiParam {Number} [age=18] 年龄
    * @apiVersion 1.0.0
   */
  async addUser (ctx) {
    ctx.verifyParams({
      username: 'string'
    });
    const username = ctx.request.body.username;
    let user = await Users.create({
      username: username
    });
    ctx.body = user;
  }

  /**
    * @apiGroup User
    * @api {GET} /user/getUserList  获取用户列表
    * @apiDescription 获取用户列表
    * @apiVersion 1.0.0
   */
  async getUserList (ctx) {
    ctx.body = await Users.find();
  }

  /**
    * @apiGroup User
    * @api {PUT} /user/updateUser/:id  修改用户信息
    * @apiDescription 通过用户的唯一标识来修改用户信息
    * @apiParam  {Number} id 用户唯一标识
    * @apiParam  {String} username 用户名
    * @apiVersion 1.0.0
   */
  async updateUser (ctx) {
    ctx.verifyParams({
      id: 'string'
    });

    let user = await Users.findOneAndUpdate({ _id: ctx.params.id }, { $set: { username: ctx.request.body.username } }, { new: true });
    ctx.body = user;
  }

  /**
    * @apiGroup User
    * @api {DELETE} /user/deleteUser/:id 删除用户
    * @apiDescription 通过用户的唯一标识来删除用户
    * @apiParam  {Number} id 用户唯一标识
    * @apiVersion 1.0.0
   */
  async deleteUser (ctx) {
    await Users.findByIdAndDelete(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new User();
