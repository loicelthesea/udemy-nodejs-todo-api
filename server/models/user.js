const mongoose = require('mongoose');

module.exports.User = mongoose.model('User', {
  email: {
    minlength: 3,
    required: true,
    trim: true,
    type: String,
  },
});
