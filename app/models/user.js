const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  avatarUrl: { type: String },
  gender: { type: String, enum: ['male', 'female'], default: 'male' }, // 性别
  headline: { type: String, select: false }, // 一句话介绍
  locations: { type: [{ type: Schema.Types.ObjectId, ref: 'topic' }], select: false, _id: 0 }, // 居住地
  business: { type: Schema.Types.ObjectId, ref: 'topic', select: false }, // 所在行业
  profession: { type: [{ company: { type: Schema.Types.ObjectId, ref: 'topic' }, position: { type: Schema.Types.ObjectId, ref: 'topic' }, _id: 0 }], select: false }, // 职业经历
  educations: { type: [{ scholl: { type: Schema.Types.ObjectId, ref: 'topic' }, major: { type: Schema.Types.ObjectId, ref: 'topic' }, level: { type: Number, enum: [1, 2, 3, 4, 5] }, entry_year: Number, graduate_year: Number, _id: 0 }], select: false }, // 1:高中及以下 2:大专 3:本科 4:硕士 5:博士及以上
  description: { type: String, select: false }, // 描述
  following: { type: [{ type: Schema.Types.ObjectId, ref: 'user' }], select: false }, // 关注的列表
  followTopics: { type: [{ type: Schema.Types.ObjectId, ref: 'topic' }], select: false } // 关注的话题列表
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
