const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
  const id = todos[0]._id.toHexString();

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
  const id = todos[0]._id.toHexString();

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

  it('should clear completedAt if not completed', done => {
    const id = todos[1]._id.toHexString();
    const text = 'TEST TODO 2 COMPLETED';

    request(app)
      .patch('/todos/' + id)
      .send({completed: false, text})
      .expect(200)
      .expect(res => expect(res.body.todo._id).toBe(id))
      .expect(res => expect(res.body.todo.completed).toBe(false))
      .expect(res => expect(res.body.todo.completedAt).toNotExist())
      .expect(res => expect(res.body.todo.text).toBe(text))
      .end(done);
  });

  it('should not update a todo with other values than text or completed', done => {
    const id = todos[1]._id.toHexString();
    const text = 'TEST TODO 2 COMPLETED';

    request(app)
      .patch('/todos/' + id)
      .send({text, completedAt: 111, anything: 'anything'})
      .expect(200)
      .expect(res => expect(res.body.todo._id).toBe(id))
      .expect(res => expect(res.body.todo.completedAt).toNotBe(111))
      .expect(res => expect(res.body.todo.anything).toBe(undefined))
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', done => {
    const email = 'test@test.com';
    const password = '123test';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body).toExist();
        expect(res.body.email).toBe('test@test.com');
      })
      .end(err => {
        if (err) return done(err);

        User.findOne({email})
          .then(user => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
          })
          .then(() => done());
      });
  });

  it('should return validation errors if request invalid', done => {
    const email = 'testtest.com';
    const password = '123test';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toNotExist();
        expect(res.body.message).toBe('User validation failed');
      })
      .end(done);
  });

  it('should not create user if email in use', done => {
    const email = users[0].email;
    const password = '123test';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end(done);
  });
});
