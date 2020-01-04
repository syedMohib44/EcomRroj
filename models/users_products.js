const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    items: [{
        item: {type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number, default: 1},
		price: {type: Number, default: 0}
    }],
    date: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Users_Products', schema); 