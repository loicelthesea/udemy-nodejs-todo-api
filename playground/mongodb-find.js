const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  (err, db) => {
    if (err) {
      return console.error('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    db.collection('Todos')
      .find()
      .count()
      .then(
        count => console.log(`Todos: ${count} elements`),
        err => console.log(err),
      );

    db.collection('Users')
      .find({name: 'LLL'})
      .toArray()
      .then(docs => console.log('Users:\n', docs), err => console.error(err));
  },
);
