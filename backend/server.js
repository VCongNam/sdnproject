const bcrypt = require("bcryptjs");
const authenticateToken = require("./middleware/auth");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const {
  Product,
  Category,
  User
} = require("./models");

dotenv.config();

const server = express();
connectDB();
server.use(cors());
server.use(express.json());

//Làm ở đây cả nhà nhé <3
// API to get all products (with optional search & category)
// server.get("/api/products", authenticateToken, async (req, res) => {
server.get("/api/products", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    const filter = {};

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Search by name (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sorting
    let optionSort = { createdAt: -1 };
    if (sort === "price_asc") optionSort = { price: 1 };
    else if (sort === "price_desc") optionSort = { price: -1 };
    else if (sort === "stock_asc") optionSort = { stock: 1 };
    else if (sort === "stock_desc") optionSort = { stock: -1 };

    const products = await Product.find(filter)
      .sort(optionSort)
      .populate("category");

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


server.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    // console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

server.post("/api/products", async (req, res) => {
  try {
    const { name, description, price, stock, category, brand } = req.body;
    const product = await Product.save();
    res.status(201).json(product);
  } catch (error) {
    // console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 9999;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
