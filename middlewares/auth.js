const jwt = require('koa-jwt');
const {
  secret
} = require('../config/index');
class Auth {
  async authUser (ctx, next) {
    jwt(secret);
    await next();
  }
}

module.exports = new Auth();
