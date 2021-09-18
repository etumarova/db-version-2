const mongoose = require("mongoose");
const CompetitionSchema = new mongoose.Schema({
  logo: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  startDate: {
    type: String,
    require: true,
  },
  endDate: {
    type: String,
    require: true,
  },
  deadLine: {
    type: String,
    require: true,
  },
  mainJudge: {
    type: String,
    require: true,
  },
  secretary: {
    type: String,
    require: true,
  },
  telephone: {
    type: String,
    require: true,
  },
  place: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  discepline: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("competition", CompetitionSchema);
