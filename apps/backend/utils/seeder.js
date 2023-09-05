const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "..", "config", "config.env") });

const connectDB = require("../helpers/databases");

//* Above imports is mandatory to run Database connection [get the environment variables]
connectDB();

const products = require("../data/products.json");
const Product = require("../models/product.model");

const seedProducts = async () => {
  try {
    const deletedProducts = await Product.deleteMany({});
    console.log(`➖➖ All Products ➖➖ \n`);
    const insertedProducts = await Product.insertMany(products);
    console.log(`➕➕ All Products ➕➕ `);
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

seedProducts();
