const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  (err, db) => {
    if (err) {
      return console.error('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // # deleteMany
    // db.collection('Todos')
    //   .deleteMany({
    //     text: 'Clean house',
    //   })
    //   .then(result => console.log(result), err => console.error(err));

    db.collection('Users')
      .deleteMany({name: 'LLL'})
      .then(cmdRes => console.log(cmdRes.result));

    // # deleteOne
    // db.collection('Todos')
    //   .deleteOne({
    //     text: 'Clean house',
    //   })
    //   .then(result => console.log(result), err => console.error(err));

    db.collection('Users')
      .deleteOne({name: 'CLL'})
      .then(cmdRes => console.log(cmdRes.result));

    // findOneAndDelete
    // db.collection('Todos')
    //   .findOneAndDelete({
    //     completed: false,
    //   })
    //   .then(result => console.log(result), err => console.error(err));
    db.collection('Users')
      .findOneAndDelete({_id: new ObjectID('5b7d8b997896112d3a35b7db')})
      .then(res => console.log(res));
  },
);
