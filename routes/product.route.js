const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { ProductModel } = require("../models/product.model");
const ProductRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /products/addproduct:
 *   post:
 *     summary: Add a new product
 *     description: Add a new product with title, image, price, category, and availability.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               availablity:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Product added successfully.
 *       500:
 *         description: Something went wrong.
 *       401:
 *         description: Unauthorized - JWT token required.
 */

ProductRouter.post("/addproduct", auth, async (req, res) => {
  try {
    const { title, image, price, category, availablity } = req.body;

    const newProduct = new ProductModel({
      title,
      image,
      price,
      category,
      availablity,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product Added successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

/**
 * @swagger
 * /products/category:
 *   get:
 *     summary: Get product categories
 *     description: Retrieve distinct product categories.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Something went wrong.
 */

ProductRouter.get("/category", async (req, res) => {
  try {
    const productcategory = await ProductModel.distinct("category");
    res.status(200).json({ category: productcategory });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

/**
 * @swagger
 * /products/products:
 *   get:
 *     summary: Get products
 *     description: Retrieve a list of products. You can filter by category using the `category` query parameter.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Optional category filter.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Something went wrong.
 */

ProductRouter.get("/products", async (req, res) => {
  try {
    const category = req.query.category;

    let products;

    if (category) {
      products = await ProductModel.find({ category: category });
      res.status(200).json(products);
    } else {
      products = await ProductModel.find();
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

/**
 * @swagger
 * /products/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve a specific product by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Something went wrong.
 */

ProductRouter.get("/products/:id", async (req, res) => {
  try {
    let id = req.params.id;

    const products = await ProductModel.find({ _id: id });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = { ProductRouter };