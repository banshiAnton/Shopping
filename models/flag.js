let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let schema = new Schema({
    country: {type: String, unique: true, required: true},
    imagePath: {type: String, required: true}
});

let Flag = mongoose.model('Flag', schema);

module.exports = Flag;