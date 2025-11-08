// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Required for frontend to talk to backend

const Product = require('./models/product.model');
const Cart = require('./models/cart.model');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    // Optional: Seed products if the collection is empty
    seedProducts();
})
.catch(err => console.error('MongoDB connection error:', err));

// Seed Products Function
async function seedProducts() {
    try {
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const products = [
                { name: 'Wireless Headphones', price: 99.99 },
                { name: 'Smartwatch', price: 199.99 },
                { name: 'Ergonomic Keyboard', price: 75.00 },
                { name: 'Portable SSD 1TB', price: 120.00 },
                { name: 'Gaming Mouse', price: 49.99 },
                { name: 'USB-C Hub', price: 35.00 },
                { name: 'Webcam 1080p', price: 60.00 },
            ];
            await Product.insertMany(products);
            console.log('Products seeded!');
        }
    } catch (error) {
        console.error('Error seeding products:', error);
    }
}

// --- API Routes ---

// GET /api/products: Get all mock items
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// Helper function to get the current cart (or create if it doesn't exist)
async function getOrCreateCart() {
    let cart = await Cart.findOne();
    if (!cart) {
        cart = new Cart({ items: [] });
        await cart.save();
    }
    return cart;
}

// POST /api/cart: Add {productId, qty}
app.post('/api/cart', async (req, res) => {
    const { productId, qty } = req.body;
    if (!productId || !qty || qty <= 0) {
        return res.status(400).json({ message: 'Product ID and quantity (must be > 0) are required.' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const cart = await getOrCreateCart();
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex > -1) {
            // Update quantity if item already in cart
            cart.items[existingItemIndex].qty += qty;
        } else {
            // Add new item to cart
            cart.items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                qty: qty,
            });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error });
    }
});

// DELETE /api/cart/:id: Remove item (where :id is the productId)
app.delete('/api/cart/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const cart = await getOrCreateCart();
        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ message: 'Item not found in cart.' });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error });
    }
});

// GET /api/cart: Get cart + total
app.get('/api/cart', async (req, res) => {
    try {
        const cart = await getOrCreateCart();
        
        let total = 0;
        cart.items.forEach(item => {
            total += item.price * item.qty;
        });

        res.json({ cart: cart.items, total: total.toFixed(2) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
});

// POST /api/checkout: {cartItems} → mock receipt (total, timestamp)
app.post('/api/checkout', async (req, res) => {
    // In a real app, you'd process payment, update inventory, etc.
    // For this mock, we just generate a receipt and clear the cart.
    const { name, email, cartItems } = req.body; // Assuming frontend sends these for the receipt

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty. Cannot checkout.' });
    }

    try {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.qty;
        });

        // Clear the cart after checkout
        let cart = await Cart.findOne();
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        const receipt = {
            orderId: new mongoose.Types.ObjectId(), // Mock order ID
            customerName: name,
            customerEmail: email,
            items: cartItems,
            total: total.toFixed(2),
            timestamp: new Date(),
            message: "Your order has been placed successfully!",
        };
        res.status(200).json(receipt);
    } catch (error) {
        res.status(500).json({ message: 'Error during checkout', error });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});