const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  (err, db) => {
    if (err) {
      return console.error('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    db.collection('Todos')
      .findOneAndUpdate(
        {_id: ObjectID('5b7d983ce2578d033f218b49')},
        {$set: {completed: true}},
        {returnOriginal: false},
      )
      .then(res => console.log(res));

    db.collection('Users')
      .findOneAndUpdate(
        {_id: ObjectID('5b7da010e2578d033f218d6d')},
        {$set: {name: 'LLL'}, $inc: {age: 1}},
        {returnOriginal: false},
      )
      .then(res => console.log(res), err => console.log(err));
  },
);
