import React, { useState } from 'react';

function CheckoutForm({ onCheckout }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && email) {
            onCheckout({ name, email });
            setName('');
            setEmail('');
        } else {
            alert('Please fill in both name and email.');
        }
    };

    return (
        <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Place Order</button>
        </form>
    );
}

export default CheckoutForm;