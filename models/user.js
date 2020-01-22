const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_name: {type: String, required: true },
    user_email: {type: String, required: true },
    user_pass: {type: String, required: true },
    user_picture: {type: String, required: false, default: ''},
    facebook: {type: String, required: false },
    tokens: Array,
    user_address: {type: String, required: true },
    user_dob: {type: Date, default: Date.now, required: true },
    history: [{
        paid: {type: Number, default: 0},
        item: {type: Schema.Types.ObjectId, ref: 'Product'}
    }],
    user_vcode: {type: String, required: false }
});

schema.methods.gravatar = (size) => {
    if (!this.size) size = 200;
    if (!this.user_email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
    const md5 = crypto.createHash('md5').update(this.user_email).digest('hex');
    /** return avator to save to database*/
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', schema); 