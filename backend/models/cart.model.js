// models/cart.model.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true }, // Store name for easier display
    price: { type: Number, required: true }, // Store price to snapshot at time of add
    qty: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema({
    // In a real app, this would be tied to a user ID. For a simple mock, we'll have one global cart.
    // Or you could use sessions/localStorage on the frontend to manage a unique cart.
    items: [cartItemSchema],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', cartSchema);