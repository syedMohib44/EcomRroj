const mongoose = require('mongoose');
const Product = require('./product.js');

var Schema = mongoose.Schema;
var schema = new Schema({
    user_id: {type: Number, required: true },
    user_products: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});
module.exports = mongoose.model('Users_Products', schema); 