const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  age: Number
}, {
  versionKey: false,
  timestamps: true
});

module.exports = model('user', userSchema);
