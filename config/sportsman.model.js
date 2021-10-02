const mongoose = require('mongoose');
const SportsmenSchema = new mongoose.Schema({
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
    fTraner: {
        type: String,
    },
    nowTraner: {
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
});
// SportsmenSchema.index({ '$**': 'text' });
module.exports = mongoose.model('sportsmen', SportsmenSchema);
