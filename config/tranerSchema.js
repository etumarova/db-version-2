const mongoose = require("mongoose");
const TranerSchema = new mongoose.Schema({
  idSchool: {
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
  birthday: {
    type: String,
    require: true,
  },
  school: {
    type: String,
    require: true,
  },
  telephone: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("traner", TranerSchema);