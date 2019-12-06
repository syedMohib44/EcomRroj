const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
    user_name: {type: String, required: true },
    user_email: {type: String, required: true },
    user_pass: {type: String, required: true },
    user_dob: {type: Date, default: Date.now, required: true },
    user_vcode: {type: String, required: false }
});
module.exports = mongoose.model('User', schema); 