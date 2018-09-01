const _ = require('lodash');
const express = require('express');
const {ObjectID} = require('mongodb');

const mongoose = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const send404 = res => res.status(404).send({});
const send400 = res => res.status(400).send({});

//GET TODOS
app.get('/todos', (req, res) => {
  Todo.find({}).then(
    todos => res.send({todos}),
    err => res.status(400).send(err),
  );
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
  const todo = new Todo({
    text: req.body.text,
  });

  todo.save().then(doc => res.send(doc), err => res.status(400).send(err));
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
  const body = _.pick(req.body, ['text', 'completed']);
  console.log(id, body);

  if (!ObjectID.isValid(id)) {
    send404(res);
  } else {
    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
      .then(todo => (todo ? res.send({todo}) : send404(res)))
      .catch(e => send404(res));
  }
});

// Start listening
app.listen(port, () => console.log(`Todo API is up on port ${port}`));

module.exports = {app};
