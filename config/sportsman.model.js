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
    fTrainer: {
        type: String,
    },
    nowTrainer: {
        type: Schema.Types.ObjectId,
        ref: 'trainer',
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
});

module.exports = mongoose.model('sportsman', SportsmanSchema);
