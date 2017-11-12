let mongoose = require('mongoose');
let Shema = mongoose.Schema;

let schema = new Shema({
    user: {type:Shema.Types.ObjectId, ref: 'User', required: true},
    cart: {type: Object, required: true},
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);