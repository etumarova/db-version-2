const mongoose = require("mongoose");
const SchoolSchema = new mongoose.Schema({
  idUser: {
    type: String,
    require: true,
  },
  foto: {
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
  adress: {
    type: String,
    require: true,
  },
  telephone: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("school", SchoolSchema);