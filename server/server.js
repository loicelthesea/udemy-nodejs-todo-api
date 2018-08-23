const express = require('express');

const mongoose = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// POST TODOS
app.post('/todos', (req, res) => {
  console.log(req.body);
  const todo = new Todo({
    text: req.body.text,
  });
  todo.save().then(doc => res.send(doc), err => res.send(err));
});

//GET TODOS

app.listen(3000, () => console.log('Todo API is up on port 3000'));
