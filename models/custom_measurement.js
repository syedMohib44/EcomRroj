const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
    cust_id: {type: Schema.Types.ObjectId, ref: 'User' },
    upper_arm: {type: Number, required: true },
    sleeve_length: {type: Number, required: true },
    sleeve_radius: {type: Number, required: true },
    chest: {type: Number, required: true },
    waist: {type: Number, required: true },
    thigh: {type: Number, required: true },
    leg: {type: Number, required: true },
    hips: {type: Number, required: true },
    desgine_img: {type: Array, required: true }
});

module.exports = mongoose.model('Custom_Measurement', schema); 