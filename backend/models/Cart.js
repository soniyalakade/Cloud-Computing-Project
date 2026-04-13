const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  name: String,
  price: Number,
  image: String,
  quantity: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model("Cart", cartSchema);