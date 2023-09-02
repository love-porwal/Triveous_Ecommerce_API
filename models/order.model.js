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
  orderDate: { type: Date, default: Date.now },
  totalOrderValue: { type: Number, required: true },
});

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = { OrderModel };