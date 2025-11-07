import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import ReceiptModal from './components/ReceiptModal';

const API_BASE_URL = 'http://localhost:5000/api'; 

function App() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/products`);
            setProducts(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/cart`);
            setCartItems(response.data.cart);
            setCartTotal(response.data.total);
            setError(null);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError("Failed to load cart. Please refresh.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId, qty = 1) => {
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/cart`, { productId, qty });
            fetchCart(); // Refresh cart after adding
            setError(null);
        } catch (err) {
            console.error("Error adding to cart:", err);
            setError("Could not add item to cart. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        setLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/cart/${productId}`);
            fetchCart(); // Refresh cart after removing
            setError(null);
        } catch (err) {
            console.error("Error removing from cart:", err);
            setError("Could not remove item from cart. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async (customerDetails) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/checkout`, {
                ...customerDetails,
                cartItems: cartItems // Send current cart items to backend for receipt generation
            });
            setReceiptData(response.data);
            setShowReceipt(true);
            fetchCart(); // Cart should be cleared on backend after checkout
            setError(null);
        } catch (err) {
            console.error("Error during checkout:", err);
            setError("Checkout failed. Please review your details and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseReceipt = () => {
        setShowReceipt(false);
        setReceiptData(null);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Vibe Commerce</h1>
                <p>Your one-stop shop for good vibes.</p>
            </header>

            {loading && <div className="loading-indicator">Loading...</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="container">
                <div className="products-section">
                    <h2>Products</h2>
                    <ProductList products={products} onAddToCart={handleAddToCart} />
                </div>

                <div className="cart-checkout-section">
                    <h2>Your Cart</h2>
                    <Cart items={cartItems} total={cartTotal} onRemoveItem={handleRemoveFromCart} />

                    {cartItems.length > 0 && (
                        <>
                            <h2>Checkout</h2>
                            <CheckoutForm onCheckout={handleCheckout} />
                        </>
                    )}
                </div>
            </div>

            {showReceipt && receiptData && (
                <ReceiptModal receipt={receiptData} onClose={handleCloseReceipt} />
            )}
        </div>
    );
}

export default App;