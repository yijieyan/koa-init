const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String
}, { versionKey: false, timestamps: true });

module.exports = model('user', userSchema);
