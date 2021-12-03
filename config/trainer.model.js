const mongoose = require('mongoose');
const TrainerSchema = new mongoose.Schema({
    schoolId: {
        type: String,
        require: true,
    },
    photo: {
        type: String,
    },
    name: {
        type: String,
        require: true,
    },
    birthday: {
        type: String,
    },
    education: {
        type: String,
    },
    laborCategory: {
        type: String,
    },
    studentNumber: {
        type: String,
    },
    school: {
        type: String,
    },
    telephone: {
        type: String,
    },
});

module.exports = mongoose.model('trainer', TrainerSchema);
