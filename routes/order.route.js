const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { OrderModel } = require("../models/order.model");
const { CartModel } = require("../models/cart.model");
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

OrderRouter.post("/order-place", auth, async (req, res) => {
  try {
    const userId = req.userData.userId;

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
      totalOrderValue: totalOrderValue,
    });

    await order.save();

    cart.products = [];
    await cart.save();

    res.status(201).json({ message: " Your order placed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to place order something went wrong" });
  }
});

OrderRouter.get("/order-details", auth, async (req, res) => {
  try {
    const userId = req.userData.userId;

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
    const userId = req.userData.userId;
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

module.exports = { OrderRouter };