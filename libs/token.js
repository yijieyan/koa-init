const jsonwebtoken = require('jsonwebtoken');
const {
  secret
} = require('../config/index');
class Token {
  async createToken (userId) {
    let token = await jsonwebtoken.sign({
      userId
    }, secret, {
      expiresIn: '1d'
    });
    return token;
  }
}

module.exports = new Token();
