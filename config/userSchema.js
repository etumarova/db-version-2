const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    isAdmin: {
        type: Boolean,
        require: true,
        default: false,
    },
    name: {
        type: String,
    },
});
module.exports = mongoose.model('user', UserSchema);
