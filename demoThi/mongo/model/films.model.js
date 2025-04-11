//kết nối collection user
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const filmsSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  film_url: { type: String, required: true},
  description: { type: String, required: true },
  viewed: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.models.film || mongoose.model("films", filmsSchema);
