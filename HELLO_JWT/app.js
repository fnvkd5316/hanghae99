const jwt = require("jsonwebtoken");

const token = jwt.sign({ test: true },'key-set_aaaa');

console.log(token);

console.log( jwt.decode(token+"123") );

let decode = jwt.verify(token, "key-set_aaaa");
console.log(decode);