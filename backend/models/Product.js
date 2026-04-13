const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  cost: Number,
  category: String,
  imageUrl: String,
  imageKey: String
});

module.exports = mongoose.model("Product", ProductSchema);

