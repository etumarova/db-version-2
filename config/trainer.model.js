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
    experience: {
        type: String,
    },
    employment: {
        type: String,
    },
    listTransfer: {
        type: String,
        require: false,
    },
    listArresters: {
        type: String,
        require: false,
    },
    listBest: {
        type: String,
        require: false,
    },
    listInNationalTeam: {
        type: String,
        require: false,
    },
    listGroups: {
        type: String,
        require: false,
    },
});

module.exports = mongoose.model('trainer', TrainerSchema);
