const mongoose = require('mongoose');
const SchoolSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    photo: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    director: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    region: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    telephone: {
        type: String,
        require: true,
    },
});
module.exports = mongoose.model('school', SchoolSchema);
