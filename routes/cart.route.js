const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { CartModel } = require("../models/cart.model");

const CartRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart Data management
 */

/**
 * @swagger
 * /cart/addtocart/{productId}:
 *   post:
 *     summary: Add a product to the cart
 *     description: Add a product to the user's cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []  # Use this to enable JWT authentication
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to add to the cart.
 *     responses:
 *       201:
 *         description: Product added to cart successfully.
 *       200:
 *         description: Product is already in the cart.
 *       500:
 *         description: Something went wrong.
 *       401:
 *         description: Unauthorized - JWT token required.
 */

/**
 * @swagger
 * /cart/removetocart/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     description: Remove a product from the user's cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []  # Use this to enable JWT authentication
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove from the cart.
 *     responses:
 *       200:
 *         description: Product removed from cart successfully.
 *       404:
 *         description: Product not found in cart.
 *       500:
 *         description: Something went wrong.
 *       401:
 *         description: Unauthorized - JWT token required.
 */

/**
 * @swagger
 * /cart/allcart:
 *   get:
 *     summary: Get the user's cart
 *     description: Retrieve the user's cart with added products.
 *     tags: [Cart]
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
 *                 $ref: '#/components/schemas/CartProduct'
 *       404:
 *         description: Cart is empty or not found.
 *       500:
 *         description: Something went wrong.
 *       401:
 *         description: Unauthorized - JWT token required.
 */

/**
 * @swagger
 * /cart/increment/{productId}:
 *   post:
 *     summary: Increase the quantity of a product in the cart
 *     description: Increase the quantity of a product in the user's cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []  # Use this to enable JWT authentication
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to increase the quantity.
 *     responses:
 *       200:
 *         description: Product quantity increased.
 *       404:
 *         description: Product not found in cart.
 *       500:
 *         description: Something went wrong.
 *       401:
 *         description: Unauthorized - JWT token required.
 */

/**
 * @swagger
 * /cart/decrement/{productId}:
 *   post:
 *     summary: Decrease the quantity of a product in the cart
 *     description: Decrease the quantity of a product in the user's cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []  # Use this to enable JWT authentication
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to decrease the quantity.
 *     responses:
 *       200:
 *         description: Product quantity updated.
 *       404:
 *         description: Product not found in cart.
 *       500:
 *         description: Something went wrong.
 *       401:
 *         description: Unauthorized - JWT token required.
 */

CartRouter.post("/addtocart/:productId", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;

    // Find the user's cart
    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      // If the cart doesn't exist, create a new one
      cart = new CartModel({
        user: userId,
        products: [{ product: productId, quantity: 1 }], // Add product with quantity 1
      });

      await cart.save();

      res.status(201).json({ message: "Product added to cart successfully" });
    } else {
      // Check if the product is already in the cart or not
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex !== -1) {
        res.status(200).json({ message: "Product is already in cart" });
      } else {
        cart.products.push({ product: productId, quantity: 1 });
        await cart.save();
        res.status(201).json({ message: "Product added to cart successfully" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

CartRouter.delete("/removetocart/:productId", auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Get the user ID from the auth middleware
    const productId = req.params.productId; // Get the product ID from the route parameter

    // Find the user's cart
    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the product from the cart's products array
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      res
        .status(200)
        .json({ message: "Product removed from cart successfully" });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

CartRouter.get("/allcart", auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Get the user ID from the auth middleware

    // Find the user's cart
    const cart = await CartModel.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart || cart.products.length == 0) {
      return res.status(404).json({ message: "Cart is empty" });
    } else {
      res.status(200).json(cart.products);
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

// Route to increase the quantity of a product in the cart
CartRouter.patch("/increment/:productId", auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Get the user ID from the auth middleware
    const productId = req.params.productId; // Get the product ID from the route parameter

    // Find the user's cart
    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
      await cart.save();
      res.status(200).json({ message: "Product quantity increased" });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

// Route to decrease the quantity of a product in the cart
CartRouter.patch("/decrement/:productId", auth, async (req, res) => {
  try {
    const userId = req.user.userId; // Get the user ID from the auth middleware
    const productId = req.params.productId; // Get the product ID from the route parameter

    // Find the user's cart
    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex !== -1) {
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity--;
      } else {
        cart.products.splice(productIndex, 1); // Remove the product if quantity is 0
      }
      await cart.save();
      res.status(200).json({ message: "Product quantity updated" });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = { CartRouter };
