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
    deputeDirector: {
        type: String,
        require: true,
    },
    deputeDirector1: {
        type: String,
        require: true,
    },
    deputeDirector2: {
        type: String,
        require: true,
    },
    directorPhone: {
        type: String,
      },
    typeSport: {
        type: String,
      },
    email: {
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
    listInventories: {
        type: String,
        require: false,
    }
});
module.exports = mongoose.model('school', SchoolSchema);
