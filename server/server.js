const express = require('express');

const mongoose = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// POST TODOS
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo.save().then(doc => res.send(doc), err => res.status(400).send(err));
});

//GET TODOS

app.listen(3000, () => console.log('Todo API is up on port 3000'));

module.exports = {app};