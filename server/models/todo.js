const mongoose = require('mongoose');

module.exports.Todo = mongoose.model('Todo', {
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Number,
    default: null,
  },
  text: {
    minlength: 1,
    required: true,
    trim: true,
    type: String,
  },
});
