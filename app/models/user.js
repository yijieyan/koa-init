const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number
}, { versionKey: false, timestamps: true });

/**
 * 验证密码
 */
UserSchema.statics.verifyPwd = (password, pwd) => {
  const isExist = bcryptjs.compareSync(password, pwd);
  return isExist;
};

/**
 * 生成密码
 */
UserSchema.statics.generatePwd = (password) => {
  let salt = bcryptjs.genSaltSync(10);
  let pwd = bcryptjs.hashSync(password, salt);
  return pwd;
};

module.exports = model('user', UserSchema);
