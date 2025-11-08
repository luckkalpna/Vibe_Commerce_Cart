// src/components/ReceiptModal.js
import React from 'react';
import './ReceiptModal.css'; // For basic styling

function ReceiptModal({ receipt, onClose }) {
    if (!receipt) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Order Receipt</h2>
                <p><strong>Order ID:</strong> {receipt.orderId}</p>
                <p><strong>Customer:</strong> {receipt.customerName} ({receipt.customerEmail})</p>
                <p><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>

                <h3>Items:</h3>
                <ul className="receipt-items-list">
                    {receipt.items.map(item => (
                        <li key={item.productId}>
                            {item.name} x {item.qty} @ ${item.price.toFixed(2)} each = ${(item.price * item.qty).toFixed(2)}
                        </li>
                    ))}
                </ul>
                <div className="receipt-total">
                    <strong>Final Total: ${receipt.total}</strong>
                </div>
                <p className="receipt-message">{receipt.message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default ReceiptModal;