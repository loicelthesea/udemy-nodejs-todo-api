const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  email: {
    minlength: 3,
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    minlength: 6,
    require: true,
    type: String,
  },
  tokens: [
    {
      access: {type: String, require: true},
      token: {type: String, require: true},
    },
  ],
});

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt
    .sign({_id: user._id.toHexString(), access}, 'secretishiding')
    .toString();

  user.tokens = [...user.tokens, {access, token}];
  return user.save().then(() => token);
};

UserSchema.methods.toJSON = function() {
  const {_id, email} = this.toObject();
  return {_id, email};
};

module.exports.User = mongoose.model('User', UserSchema);
