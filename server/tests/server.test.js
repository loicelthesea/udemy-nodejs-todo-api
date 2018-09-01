const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {
    text: 'TEST TODO 1',
    _id: new ObjectID(),
  },
  {
    text: 'TEST TODO 2',
    _id: new ObjectID(),
    completed: true,
    completedAt: 7357,
  },
  {
    text: 'TEST TODO 3',
    _id: new ObjectID(),
  },
];

todos.getId = index => todos[index]._id.toHexString();

beforeEach(done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => {
      done();
    });
});

describe('POST /todos', () => {
  it('should create a new todo', done => {
    const text = 'TEST TEXT';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect(res => expect(res.body.text).toBe(text))
      .end((err, res) => {
        if (err) return done(err);

        Todo.find({text})
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .expect(res => expect(res.body.name).toEqual('ValidationError'))
      .end((err, res) => {
        if (err) return done(err);

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(3);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => expect(res.body.todos.length).toBe(3))
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  const id = todos.getId(0);

  it('should get a todo', done => {
    request(app)
      .get('/todos/' + id)
      .expect(200)
      .expect(res => expect(res.body.todo.text).toBe(todos[0].text))
      .expect(res => expect(res.body.todo._id).toBe(id))
      .end(done);
  });

  it('should get 404 if ID not found', done => {
    request(app)
      .get('/todos/' + new ObjectID().toHexString())
      .expect(404)
      .end(done);
  });

  it('should get 404 if ID not valid', done => {
    request(app)
      .get('/todos/ANYTHING')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  const id = todos.getId(0);

  it('should remove a todo', done => {
    request(app)
      .delete('/todos/' + id)
      .expect(200)
      .expect(res => expect(res.body.todo._id).toBe(id))
      .end((err, res) => {
        if (err) return done(err);

        Todo.findById(id)
          .then(doc => {
            expect(doc).toNotExist();
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .delete('/todos/' + new ObjectID().toHexString())
      .expect(404)
      .end(done);
  });

  it('should return 404 if ID not valid', done => {
    request(app)
      .delete('/todos/ANYTHING')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a todo', done => {
    const id = todos[0]._id.toHexString();
    const text = 'TEST TODO 1 COMPLETED';

    request(app)
      .patch('/todos/' + id)
      .send({completed: true, text})
      .expect(200)
      .expect(res => expect(res.body.todo._id).toBe(id))
      .expect(res => expect(res.body.todo.completed).toBe(true))
      .expect(res => expect(res.body.todo.completedAt).toBeA('number'))
      .expect(res => expect(res.body.todo.text).toBe(text))
      .end(done);
  });

  it('should update a todo & clearing completedAt if completed set to false', done => {
    const id = todos[1]._id.toHexString();
    const text = 'TEST TODO 2 COMPLETED';

    request(app)
      .patch('/todos/' + id)
      .send({completed: false, text})
      .expect(200)
      .expect(res => expect(res.body.todo._id).toBe(id))
      .expect(res => expect(res.body.todo.completed).toBe(false))
      .expect(res => expect(res.body.todo.completedAt).toBe(null))
      .expect(res => expect(res.body.todo.text).toBe(text))
      .end(done);
  });
});
