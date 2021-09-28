const mongoose = require('mongoose');
const SportsmenSchema = new mongoose.Schema({
    idSchool: {
        type: String,
        require: true,
    },
    foto: {
        type: String,
    },
    name: {
        type: String,
        require: true,
    },
    birthday: {
        type: String,
    },
    fTraner: {
        type: String,
    },
    nowTraner: {
        type: String,
    },
    school: {
        type: String,
    },
    adress: {
        type: String,
    },
    telephone: {
        type: String,
    },
    listResults: {
        type: String,
    },
});
// SportsmenSchema.index({ '$**': 'text' });
module.exports = mongoose.model('sportsmen', SportsmenSchema);
