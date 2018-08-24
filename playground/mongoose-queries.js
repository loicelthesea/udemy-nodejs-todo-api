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

(() => {
  const id = '5b803f41df16662a6a051814';
  const badid = '0b000f00df00000a0a000000';
  const verybadid = 'X0Z000f00df00000a0a000000';
  const log = doc => console.log('Todo:', doc);
  const logError = err => console.log('Todo: Error:', err);

  Todo.find({_id: id}).then(log);

  Todo.findOne({_id: id}).then(log);

  validAndFindById(Todo, id)
    .then(log, logError)
    .catch(logError);

  validAndFindById(Todo, badid)
    .then(log, logError)
    .catch(logError);

  validAndFindById(Todo, verybadid)
    .then(log, logError)
    .catch(logError);
})();

(() => {
  const id = '5b7dacd4fea6eaff57f411cc';
  const badid = '0b000f00df00000a0a000000';
  const verybadid = 'X0Z000f00df00000a0a000000';
  const log = doc => console.log('User:', doc);
  const logError = err => console.log('User: Error:', err);

  validAndFindById(User, id)
    .then(log, logError)
    .catch(logError);

  validAndFindById(User, badid)
    .then(log, logError)
    .catch(logError);

  validAndFindById(User, verybadid)
    .then(log, logError)
    .catch(logError);
})();
