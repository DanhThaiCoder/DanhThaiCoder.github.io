//kết nối collection user
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: String, required: false},
    address: {type: String, required: false},
    role: {type: Number, required: true, default: 1},
    img: {type: String, required: false},
    dateOfBirth: {type: Date, required: false},
    gender: {type: Number, required: false},
    status: {type:Number, required: false},
});

module.exports = mongoose.models.user || mongoose.model('users', userSchema);