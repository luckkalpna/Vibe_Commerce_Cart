// src/components/ProductList.js
import React from 'react';
import './ProductList.css'; // For basic styling

function ProductList({ products, onAddToCart }) {
    return (
        <div className="product-grid">
            {products.map(product => (
                <div key={product._id} className="product-card">
                    <h3>{product.name}</h3>
                    <p>${product.price.toFixed(2)}</p>
                    <button onClick={() => onAddToCart(product._id)}>Add to Cart</button>
                </div>
            ))}
        </div>
    );
}

export default ProductList;