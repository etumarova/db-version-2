const mongoose = require('mongoose');
const TranerSchema = new mongoose.Schema({
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
    school: {
        type: String,
    },
    telephone: {
        type: String,
    },
});
module.exports = mongoose.model('traner', TranerSchema);
