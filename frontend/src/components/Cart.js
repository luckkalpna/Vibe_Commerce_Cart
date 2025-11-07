import React from 'react';

function Cart({ items, total, onRemoveItem }) {
    return (
        <div className="cart-container">
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul className="cart-list">
                        {items.map(item => (
                            <li key={item.productId} className="cart-item">
                                <span>{item.name} x {item.qty}</span>
                                <span>${(item.price * item.qty).toFixed(2)}</span>
                                <button onClick={() => onRemoveItem(item.productId)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-total">
                        <strong>Total: ${total}</strong>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;