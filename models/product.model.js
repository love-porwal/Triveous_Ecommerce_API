const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  availablity: { type: Boolean, default: true },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = { ProductModel };