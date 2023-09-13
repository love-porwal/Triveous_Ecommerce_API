const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  // orderStatus:{type: String, default:"ordered"},
  orderDate: { type: Date, default: Date.now },
 
  totalOrderValue: { type: Number, required: true },
});

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = { OrderModel };