let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    cart: {type: Object}
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);