//const mongoose = require('../server/shop_database');
const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
    product_type_name: {type: String, required: true },
    product_subtype_name: {type: String, required: true },
    product_sub_subtype_name: {type: String, required: true },
    product_type_quantity: {type: Number, required: true },
});
module.exports = mongoose.model('Product_Type', schema); 