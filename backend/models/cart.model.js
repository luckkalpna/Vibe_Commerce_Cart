// models/cart.model.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true }, 
    price: { type: Number, required: true }, 
    qty: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema({
    items: [cartItemSchema],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', cartSchema);