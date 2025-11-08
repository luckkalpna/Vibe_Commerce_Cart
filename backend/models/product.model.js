// models/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    // You could add an image field here if you wanted to display product images
    // imageUrl: String,
});

module.exports = mongoose.model('Product', productSchema);