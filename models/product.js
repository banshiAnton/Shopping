let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    country:{type: String, required: true},
    img: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
});

let Product = mongoose.model('Product', schema);

module.exports = Product;