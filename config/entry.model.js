const mongoose = require('mongoose');
const EntriesSchema = new mongoose.Schema({
    competitionId: {
        type: String,
        require: true,
    },
    schoolId: {
        type: String,
        require: true,
    },
    trainer: {
        type: String,
        require: true,
    },
    telephone: {
        type: String,
        require: true,
    },
    dateSend: {
        type: String,
        require: true,
    },
    sportsmenList: {
        type: String,
        require: true,
    },
});
module.exports = mongoose.model('entrie', EntriesSchema);
