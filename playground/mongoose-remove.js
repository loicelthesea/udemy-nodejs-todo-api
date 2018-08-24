const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const validAndFindById = (model, id) =>
  ObjectID.isValid(id)
    ? model
        .findById(id)
        .then(doc => (doc ? doc : Promise.reject(`ID not exist: ${id}`)))
    : Promise.reject(`ID not valid: ${id}`);

// Todo.remove({}); // PURGE
// Todo.findOneAndRemove // query deletion
// Todo.findByIdAndRemove // unit deletion by id

const id = '5b806b7681ee595155b3cf91';
Todo.findByIdAndRemove(id).then(todo => console.log(todo));

Todo.findOneAndRemove({text: 'TEST TODO 2'}).then(todo => console.log(todo));
