const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
  id: 4,
};

const token = jwt.sign(data, 'secret');
console.log(token);
const decoded = jwt.verify(token, 'secret');
console.log(decoded);

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
