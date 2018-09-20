const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const data = {
  id: 4,
};

// const token = jwt.sign(data, 'secret');
// console.log(token);
// const decoded = jwt.verify(token, 'secret');
// console.log(decoded);

//
// const message = 'This is a test';
// const hash = SHA256(message);
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// const data = {
//   id: 4,
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret').toString(),
// };
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// const resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data validated');
// } else {
//   console.log('Data has been modified!');
// }

const hashAndLog = pwd => {
  const hash = bcrypt.hashSync(pwd, 8);
  console.log('hash', hash);
  return hash;
};

const checkHashAndLog = (pwd, hash) => {
  const res = bcrypt.compareSync(pwd, hash);
  console.log('valid ?', res);
  return res;
};

const hash1 = '$2a$10$SheTxVXUJ9pwM0Ykkod6y.UY63FpImpYkw9Rv.NBZjKSzBw/ToABu';
const hash2 = '$2a$10$SheTxVXUJ9wM0Ykkod6y.UY63FpImpYkw9Rv.NBZjKSzBw/ToABu';
const hash3 = '$2a$10$q4HlaOOEQ2a.iesTYDdYe.nGlUFy8eWnY9hg1J1lziXEqe3/xUHYq';

checkHashAndLog('123abc', hash1);
checkHashAndLog('123abc', hash2);
checkHashAndLog('TESTTEST', hash3);
