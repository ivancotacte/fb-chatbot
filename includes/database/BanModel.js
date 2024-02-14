const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BanUser = new Schema({
  fbID: {
    type: String,
  },
  fbFullName: {
    type: String,
  }
});

module.exports = mongoose.model("BanUser", BanUser);