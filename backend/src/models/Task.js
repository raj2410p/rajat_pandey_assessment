const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  inputText: {
    type: String,
    required: [true, 'Input text is required']
  },
  operation: {
    type: String,
    required: [true, 'Operation is required'],
    enum: ['uppercase', 'lowercase', 'reverse', 'word_count']
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'success', 'failed'],
    default: 'pending'
  },
  logs: {
    type: [String],
    default: []
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
