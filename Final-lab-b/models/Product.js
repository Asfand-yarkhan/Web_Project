const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  categories: {
    type: [String], // Array of strings for categories
    required: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
