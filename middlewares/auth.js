const jwt = require('jsonwebtoken');
const {
  secret
} = require('../config/index');
class Auth {
  async authUser (ctx, next) {
    let token = ctx.header.authorization || '';
    token = token.replace('Bearer ', '').trim();
    try {
      let obj = jwt.verify(token, secret);
      ctx.state.user = obj;
    } catch (err) {
      ctx.throw(403, '没有权限');
    }
    await next();
  }
}

module.exports = new Auth();
