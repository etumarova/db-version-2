const mongoose = require("mongoose");
const EntriesSchema = new mongoose.Schema({
  idCompetition: {
    type: String,
    require: true,
  },
  idSchool: {
    type: String,
    require: true,
  },
  traner: {
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
  sportsmensList: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("entrie", EntriesSchema);
