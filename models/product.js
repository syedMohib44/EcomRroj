const mongoose = require('mongoose');
//const mongoose = require('../server/shop_database');

var Schema = mongoose.Schema;
var schema = new Schema({
    product_name: {type: String, required: true },
    product_type: {type: String, required: true },
    product_description: {type: String, required: true },
    //product_img: {type: String, required: true },
    product_img: {type: Array, required: true }, //need to store image of product in an array...
    product_XS: {type: Number, required: true },
    product_S: {type: Number, required: true },
    product_M: {type: Number, required: true },
    product_L: {type: Number, required: true },
    product_XL: {type: Number, required: true },
    product_XXL: {type: Number, required: true },
    //product_for: {type: String, required: true },
    product_price: {type: Number, required: true },
});

module.exports = mongoose.model('Product', schema); 
//mongoose.connect('mongodb://localhost:27017/shopdb', { useNewUrlParser: true,  useUnifiedTopology: true});
