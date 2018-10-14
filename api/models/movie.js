const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create movie schema and model
const MovieSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required!"]
  },
  year: {
    type: String
  }
});

const Movie = mongoose.model("movie", MovieSchema);

module.exports = Movie;
