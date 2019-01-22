const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const todos = [
  {
    text: 'TEST TODO 1',
    _id: new ObjectID(),
  },
  {
    text: 'TEST TODO 2',
    _id: new ObjectID(),
    completed: true,
    completedAt: 7357,
  },
  {
    text: 'TEST TODO 3',
    _id: new ObjectID(),
  },
];

const populateTodos = done => {
  Todo.remove({})
    .then(() => Todo.insertMany(todos))
    .then(() => done());
};

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
  {
    _id: userOneId,
    email: 'userone@test.com',
    password: 'useronepass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString(),
      },
    ],
  },
  {
    _i: userTwoId,
    email: 'usertwo@test.com',
    password: 'usertwopass',
  },
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
