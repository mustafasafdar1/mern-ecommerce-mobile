import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, authHeader } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({ address: '', city: '', postalCode: '', country: 'Pakistan', paymentMethod: 'EasyPaisa' });

    const fmt = (p) => `PKR ${Number(p || 0).toLocaleString('en-US')}`;
    const tax = Math.round(cartTotal * 0.18);
    const total = cartTotal + tax;

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleOrder = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please sign in to place an order');
        if (!cartItems.length) return toast.error('Your cart is empty');
        setLoading(true);
        try {
            const orderItems = cartItems.map(i => ({ product: i._id, name: i.name, image: i.images?.[0], price: i.price, quantity: i.qty }));
            await axios.post('/api/orders', {
                orderItems,
                shippingAddress: { address: form.address, city: form.city, postalCode: form.postalCode, country: form.country },
                paymentMethod: form.paymentMethod,
                itemsPrice: cartTotal,
                shippingPrice: 0,
                taxPrice: tax,
                totalPrice: total,
            }, { headers: authHeader() });
            clearCart();
            setSuccess(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Order failed. Try again.');
        } finally { setLoading(false); }
    };

    if (user?.role === 'admin') return (
        <div className="checkout-page" style={{ padding: '120px 0' }}>
            <div className="container">
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <h2>Admin Account</h2>
                    <p>Admin users cannot place orders. Manage products and orders from the Admin Dashboard.</p>
                    <Link to="/admin" className="btn btn-primary">Go to Admin Dashboard</Link>
                </div>
            </div>
        </div>
    );

    if (success) return (
        <div className="checkout-success">
            <motion.div className="success-card card"
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="success-icon"><FiCheckCircle /></div>
                <h2>Order Placed Successfully! 🎉</h2>
                <p>Thank you for your order. Your phone is on its way!</p>
                <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Back to Home</button>
            </motion.div>
        </div>
    );

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>
                <div className="checkout-layout">
                    <form onSubmit={handleOrder} className="checkout-form">
                        <div className="checkout-section card">
                            <h2>Shipping Address</h2>
                            <div className="form-group">
                                <label className="form-label">Street Address</label>
                                <input className="form-input" name="address" placeholder="123 Main Street" value={form.address} onChange={handleChange} required />
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input className="form-input" name="city" placeholder="Mumbai" value={form.city} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Postal Code</label>
                                    <input className="form-input" name="postalCode" placeholder="400001" value={form.postalCode} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Country</label>
                                <input className="form-input" name="country" value={form.country} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="checkout-section card">
                            <h2>Payment Method</h2>
                            <div className="payment-options">
                                {['EasyPaisa', 'JazzCash', 'NayaPay', 'Sadapay', 'Cash on Delivery', 'Credit/Debit Card'].map(m => (
                                    <label key={m} className="payment-option">
                                        <input type="radio" name="paymentMethod" value={m} checked={form.paymentMethod === m} onChange={handleChange} />
                                        <span>{m}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button className="btn btn-primary place-order-btn" type="submit" disabled={loading || !cartItems.length}>
                            {loading ? 'Placing Order...' : `Place Order — PKR ${Number(total).toLocaleString('en-US')}`}
                        </button>
                    </form>

                    <div className="checkout-summary card">
                        <h2>Order Summary</h2>
                        <div className="order-items">
                            {cartItems.map(item => (
                                <div key={item._id} className="order-item">
                                    <img src={item.images?.[0]} alt={item.name} />
                                    <div className="order-item-info">
                                        <span className="order-item-name">{item.name}</span>
                                        <span className="order-item-qty">Qty: {item.qty}</span>
                                    </div>
                                    <span className="order-item-price">{fmt(item.price * item.qty)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-lines">
                            <div className="summary-line"><span>Subtotal</span><span>{fmt(cartTotal)}</span></div>
                            <div className="summary-line"><span>Shipping</span><span className="text-green">Free</span></div>
                            <div className="summary-line"><span>GST (18%)</span><span>{fmt(tax)}</span></div>
                            <div className="summary-line total-line"><span>Total</span><span>{fmt(total)}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .checkout-page { padding: 100px 0 4rem; }
        .page-title { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; margin-bottom: 2rem; }
        .checkout-layout { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; align-items: start; }
        .checkout-section { padding: 1.75rem; margin-bottom: 1.25rem; }
        .checkout-section h2 { font-family: var(--font-heading); font-size: 1rem; font-weight: 700; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .payment-options { display: flex; flex-direction: column; gap: 0.7rem; }
        .payment-option { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.85rem 1rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border); transition: var(--transition); color: var(--text-secondary); font-size: 0.9rem; }
        .payment-option:has(input:checked) { border-color: var(--accent-blue); background: rgba(59,130,246,0.06); color: var(--text-primary); }
        .payment-option input { accent-color: var(--accent-blue); }
        .place-order-btn { width: 100%; justify-content: center; padding: 1rem; font-size: 1.05rem; }
        .checkout-summary { padding: 1.75rem; position: sticky; top: 90px; }
        .checkout-summary h2 { font-family: var(--font-heading); font-size: 1rem; font-weight: 700; margin-bottom: 1.25rem; }
        .order-items { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; max-height: 250px; overflow-y: auto; }
        .order-item { display: flex; align-items: center; gap: 0.75rem; }
        .order-item img { width: 52px; height: 52px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
        .order-item-info { flex: 1; min-width: 0; }
        .order-item-name { display: block; font-size: 0.8rem; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .order-item-qty { font-size: 0.75rem; color: var(--text-muted); }
        .order-item-price { font-size: 0.85rem; font-weight: 600; flex-shrink: 0; }
        .summary-lines { display: flex; flex-direction: column; gap: 0.6rem; }
        .summary-line { display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--text-secondary); }
        .summary-line.total-line { color: var(--text-primary); font-weight: 700; font-size: 1rem; padding-top: 0.6rem; border-top: 1px dashed var(--border); }
        .text-green { color: #4ade80; font-weight: 600; }
        .checkout-success { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .success-card { padding: 3rem; text-align: center; max-width: 440px; width: 100%; }
        .success-icon { font-size: 4rem; color: #4ade80; margin-bottom: 1rem; display: flex; justify-content: center; }
        .success-card h2 { font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 0.5rem; }
        .success-card p { color: var(--text-muted); }
        @media (max-width: 900px) { .checkout-layout { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .form-row-2 { grid-template-columns: 1fr; } }
      `}</style>
        </div>
    );
};

export default CheckoutPage;
