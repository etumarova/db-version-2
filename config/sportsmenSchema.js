const mongoose = require("mongoose");
const SportsmenSchema = new mongoose.Schema({
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
  fTraner: {
    type: String,
    require: true,
  },
  nowTraner: {
    type: String,
    require: true,
  },
  school: {
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
  listResults: {
    type: String,
    require: true,
  },
});
SportsmenSchema.index({ "$**": "text" });
module.exports = mongoose.model("sportsmen", SportsmenSchema);