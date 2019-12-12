const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
    seller_name: {type: String, required: true },
    seller_email: {type: String, required: true },
    seller_pass: {type: String, required: true },
    seller_dob: {type: String, required: true },
    seller_cnic: {type: String, required: true },
    seller_cellno: {type: String, required: true },
    seller_address: {type: String, required: true },
    seller_country: {type: String, required: true },
    seller_city: {type: String, required: true }
});

module.exports = mongoose.model('Seller', schema); 