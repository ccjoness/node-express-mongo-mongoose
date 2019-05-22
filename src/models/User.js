const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: 'string',
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 40,
    },
    password: {
        type: 'string',
        required: true,
    },

}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;