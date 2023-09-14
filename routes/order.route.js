const express = require("express");
const { client } = require("../config/db");
const { auth } = require("../middleware/auth.middleware");
const { OTP } = require("../middleware/otp.middleware");
const { rateLimit } = require("../middleware/rateLimiter.middleware");
const { OrderModel } = require("../models/order.model");
const { CartModel } = require("../models/cart.model");
const { uuid } = require('uuidv4');
const OrderRouter = express.Router();


/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management section
 */

/**
 * @swagger
 * /orders/order-place:
 *   post:
 *     summary: Place a new order
 *     description: Place a new order with items from the user's cart.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []  # Use this to enable JWT authentication
 *     responses:
 *       201:
 *         description: Order placed successfully.
 *       404:
 *         description: Unable to find cart.
 *       500:
 *         description: Unable to place order, something went wrong.
 *       401:
 *         description: Unauthorized - JWT token required.
 */

/**
 * @swagger
 * /orders/order-details:
 *   get:
 *     summary: Get order details
 *     description: Retrieve order details for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []  # Use this to enable JWT authentication
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: An error occurred.
 *       401:
 *         description: Unauthorized - JWT token required.
 */

/**
 * @swagger
 * /orders/order/{orderId}:
 *   get:
 *     summary: Get an order by ID
 *     description: Retrieve a specific order by its ID for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []  # Use this to enable JWT authentication
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to retrieve.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found.
 *       500:
 *         description: An error occurred.
 *       401:
 *         description: Unauthorized - JWT token required.
 */

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

let generatedOTP;

OrderRouter.get("/generate-otp", auth, rateLimit, async (req, res) => {
  try {
    const Id = uuid();
    generatedOTP = generateOTP();
    console.log(`Generated OTP: ${generatedOTP}`);
    await client.set(Id, generatedOTP);
    console.log("userId:", Id);
    res.status(200).json({ message: "OTP generated successfully", ok: true, Id });
  } catch (error) {
    res.send({ msg: error.message });
  }
});

OrderRouter.post("/verified-otp", auth, OTP, async (req, res) => {
  try {
    console.log({ message: "OTP verified successfully" });
    res
      .status(200)
      .json({ message: "OTP verified successfully", success: true });
  } catch (error) {
    res.send({ msg: error.message });
  }
});

OrderRouter.post("/order-place", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
    const cart = await CartModel.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(404).json({ message: "Unable to found cart" });
    }

    const totalOrderValue = cart.products.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    const order = new OrderModel({
      user: userId,
      items: cart.products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      orderStatus: [{
        status: "Order placed",
        description: "order is placed successfully"
      }],
      totalOrderValue: totalOrderValue,
    });

    await order.save();

    cart.products = [];
    await cart.save();

    res.status(201).json({ message: " Your order placed successfully" });
  } catch (error) {
    res.status(500).json({
      err: error.message,
      message: "Unable to place order something went wrong",
    });
  }
});

OrderRouter.get("/order-details", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await OrderModel.find({ user: userId })
      .populate("items.product")
      .sort("-orderDate");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});



OrderRouter.get("/order/:orderId", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = req.params.orderId;

    const order = await OrderModel.findOne({
      _id: orderId,
      user: userId,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

OrderRouter.patch("/updateStatus", auth, async (req, res) => {
  try {
    const status = req.query.status
    const orderId = req.query.orderId
    const shipment = await OrderModel.findOne({ _id: orderId })
    let obj = {}
    let arr = shipment.orderStatus;
    let count =0;
    for (let item in arr) {
      if(arr[item].status == status){
        count++;
      }
    }
    console.log(count);
    console.log(obj)
    if (status == "confirmed" ) {
      obj.status = "confirmed"
      obj.description = "Order is confirmed by the seller"
    } else if (status == "payment confirmed") {
      obj.status = "payment confirmed"
      obj.description = "Payment is confirmed"
    } else if (status == "Delivered successfully") {
      obj.status = "Delivered successfully"
      obj.description = "Order delivered successfully"
    }
    console.log(obj);
    if (count!==0) {
      res.status(200).json({ message: "Order status already updated" });
    } else {
      shipment.orderStatus.push(obj);
      // console.log(shipment);
      await shipment.save()
      res.status(200).json({ message: "Order status updated" });
    }

  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
})


module.exports = { OrderRouter };
