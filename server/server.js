const express = require('express');
const {ObjectID} = require('mongodb');

const mongoose = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const send404 = res => res.status(404).send({});
const send400 = (res, err) => res.status(400).send(err);

// POST A TODO
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo.save().then(doc => res.send(doc), err => res.status(400).send(err));
});

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
      error => send404(res),
    );
  }
});

// Start listening
app.listen(3000, () => console.log('Todo API is up on port 3000'));

module.exports = {app};
