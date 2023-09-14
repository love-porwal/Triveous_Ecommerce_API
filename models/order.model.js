const mongoose = require("mongoose");

const orderStatusSchema = new mongoose.Schema({
  status: { type: String},
  timestamp: { type: Date, default: Date.now },
  description: { type: String },
});

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
  orderStatus: [orderStatusSchema], // Array of order status objects
  totalOrderValue: { type: Number, required: true },
});


const OrderModel = mongoose.model("Order", orderSchema);

module.exports = { OrderModel };