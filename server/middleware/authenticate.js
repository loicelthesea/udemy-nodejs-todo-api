const {User} = require('../models/user');

const authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject('Unable to find user with token');
      } else {
        req.token = token;
        req.user = user;
        next();
      }
    })
    .catch(err => res.status(401).send());
};

module.exports = {authenticate};
