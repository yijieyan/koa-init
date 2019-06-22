const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const TopicSchema = new Schema({
  name: String,
  avatarUrl: String,
  introduction: { type: String, select: false }
}, { versionKey: false, timestamps: true });

module.exports = model('topic', TopicSchema);
