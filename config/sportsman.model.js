const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SportsmanSchema = new mongoose.Schema({
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
    enrolmentDate: {
        type: String,
    },
    placeStudy: {
        type: String,
    },
    nowTrainer: {
        type: Schema.Types.ObjectId,
        ref: 'trainer',
    },
    fTrainer: {
        type: String,
    },
    school: {
        type: String,
    },
    address: {
        type: String,
    },
    telephone: {
        type: String,
    },
    listResults: {
        type: String,
    },
    mum: {
        type: String,
    },
    mumPhone: {
        type: String,
    },
    dad: {
        type: String,
    },
    dadPhone: {
        type: String,
    },
    unenrolmentDate: {
        type: String,
    },
    causeUnenrolment: {
        type: String,
    },
    anthropometricData: {
        type: String,
    },
    livingAddress: {
        type: String,
    },
    education: {
        type: String,
    },
    schedule: {
        type: String,
    },
    rank: {
        type: String,
    },
    assignment: {
        type: String,
    },
    group: {
        type: String,
    },

});

module.exports = mongoose.model('sportsman', SportsmanSchema);
