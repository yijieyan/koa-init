const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const AnwserSchema = new Schema({
  content: String,
  questionId: { type: String, required: true },
  anwser: { type: Schema.Types.ObjectId, ref: 'user', select: false, required: true }
}, { versionKey: false, timestamps: true });

module.exports = model('anwser', AnwserSchema);
