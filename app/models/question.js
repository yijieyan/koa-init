const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const QuestionSchema = new Schema({
  title: String,
  description: String,
  questioner: { type: Schema.Types.ObjectId, ref: 'user', select: false },
  topicLists: [{ type: Schema.Types.ObjectId, ref: 'topic' }]
}, { versionKey: false, timestamps: true });

module.exports = model('question', QuestionSchema);
