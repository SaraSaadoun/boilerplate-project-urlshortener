const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//schema
const urlSchema = new Schema({
  original_url: {
    type: String,
    required: true,
  },
});
//model
const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
