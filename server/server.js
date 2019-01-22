require('./config');

const express = require('express');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const log = fn => (...args) => {
  // console.log(...args);
  fn(...args);
};
const send400 = (res, err) => res.status(400).send(err);
const send401 = (res, err) => res.status(401).send();
const send404 = (res, err) => res.status(404).send();

//GET TODOS
app.get('/todos', (req, res) => {
  Todo.find({}).then(todos => res.send({todos}), err => send400(res));
});

// GET A TODO BY ID
app.get('/todos/:id', (req, res) => {
  const {id} = req.params;

  if (!ObjectID.isValid(id)) {
    send404(res);
  } else {
    Todo.findById(id).then(
      todo => (todo ? res.send({todo}) : send404(res)),
      error => send400(res),
    );
  }
});

// POST A TODO
app.post('/todos', (req, res) => {
  const {text} = req.body;
  const todo = new Todo({text});
  todo
    .save()
    .then(doc => res.send(doc))
    .catch(err => send400(res, err));
});

// DELETE A TODO BY ID
app.delete('/todos/:id', (req, res) => {
  const {id} = req.params;

  if (!ObjectID.isValid(id)) {
    send404(res);
  } else {
    Todo.findByIdAndRemove(id).then(
      todo => (todo ? res.send({todo}) : send404(res)),
      error => send400(res),
    );
  }
});

// PATCH A TODO BY ID
app.patch('/todos/:id', (req, res) => {
  const {id} = req.params;
  const {text, completed} = req.body;
  const todo = {text, completed};

  if (!ObjectID.isValid(id)) {
    send404(res);
  } else {
    if (todo.completed === true) {
      todo.completedAt = new Date().getTime();
    } else {
      todo.completed = false;
      todo.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: todo}, {new: true})
      .then(todo => (todo ? res.send({todo}) : send404(res)))
      .catch(e => send404(res));
  }
});

// POST A USER
app.post('/users', (req, res) => {
  const {email, password} = req.body;
  const user = new User({email, password});

  user
    .save()
    .then(() => user.generateAuthToken())
    .then(token => {
      res.header('x-auth', token);
      res.send(user);
    })
    .catch(err => send400(res, err));
});

// GET USER ME
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// Start listening
app.listen(port, () => console.log(`Todo API is up on port ${port}`));

module.exports = {app};
