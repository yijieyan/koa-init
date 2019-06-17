const jsonwebtoken = require('jsonwebtoken');
const {
  secret
} = require('../config/index');
class Token {
  createToken (userId) {
    let token = jsonwebtoken.sign({
      userId
    }, secret, {
      expiresIn: '1d'
    });
    return token;
  }
}

module.exports = new Token();
