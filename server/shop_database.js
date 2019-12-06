// const mysql = require('mysql');
// module.exports = mysql.createConnection({
//     host : 'localhost',
//     user : 'root',
//     password : '',
//     database : 'shopdb'
// });

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopdb', { useNewUrlParser: true,  useUnifiedTopology: true});

module.exports = mongoose;