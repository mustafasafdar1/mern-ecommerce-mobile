import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const fmt = (p) => `PKR ${Number(p || 0).toLocaleString('en-US')}`;
    const shipping = 0;
    const tax = Math.round(cartTotal * 0.18);
    const total = cartTotal + shipping + tax;

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>
                {user?.role === 'admin' ? (
                    <div className="empty-state">
                        <h2>Admin accounts cannot shop</h2>
                        <p>Use the Admin Dashboard to manage products and orders.</p>
                        <Link to="/admin" className="btn btn-primary">Go to Admin</Link>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="empty-state">
                        <FiShoppingBag size={72} />
                        <h2>Your cart is empty</h2>
                        <p>Browse our store and find amazing deals</p>
                        <Link to="/shop" className="btn btn-primary">Shop Now <FiArrowRight /></Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items-section">
                            <div className="cart-items-header">
                                <span>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
                                <button className="clear-btn" onClick={clearCart}>Clear All</button>
                            </div>
                            {cartItems.map((item, i) => (
                                <motion.div key={item._id} className="cart-row card"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07 }}>
                                            <Link to={`/product/${item._id}`}>
                                                <img src={item.images?.[0] || item.mobileImages?.[0] || 'https://via.placeholder.com/120x120?text=No'} alt={item.name} className="cart-row-img" onError={(e)=>{e.target.onerror=null;e.target.src=item.mobileImages?.[0]||'https://via.placeholder.com/120x120?text=No'}} />
                                            </Link>
                                    <div className="cart-row-info">
                                        <div className="cart-row-brand">{item.brand}</div>
                                        <Link to={`/product/${item._id}`} className="cart-row-name">{item.name}</Link>
                                        <div className="cart-row-price">{fmt(item.price)}</div>
                                    </div>
                                    <div className="cart-row-controls">
                                        <div className="qty-box">
                                            <button onClick={() => updateQty(item._id, item.qty - 1)}><FiMinus /></button>
                                            <span>{item.qty}</span>
                                            <button onClick={() => updateQty(item._id, item.qty + 1)} disabled={item.qty >= item.countInStock}><FiPlus /></button>
                                        </div>
                                        <div className="cart-row-subtotal">{fmt(item.price * item.qty)}</div>
                                        <button className="row-delete" onClick={() => removeFromCart(item._id)}><FiTrash2 /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="cart-summary-panel card">
                            <h2>Order Summary</h2>
                            <div className="summary-lines">
                                <div className="summary-line">
                                    <span>Subtotal ({cartItems.reduce((a, i) => a + i.qty, 0)} items)</span>
                                    <span>{fmt(cartTotal)}</span>
                                </div>
                                <div className="summary-line">
                                    <span>Shipping</span>
                                    <span className="text-green">Free</span>
                                </div>
                                <div className="summary-line">
                                    <span>GST (18%)</span>
                                    <span>{fmt(tax)}</span>
                                </div>
                                <div className="summary-line total-line">
                                    <span>Total</span>
                                    <span>{fmt(total)}</span>
                                </div>
                            </div>
                            <Link to="/checkout" className="btn btn-primary checkout-big-btn">
                                Proceed to Checkout <FiArrowRight />
                            </Link>
                            <Link to="/shop" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .cart-page { padding: 100px 0 4rem; }
        .page-title { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; margin-bottom: 2rem; }
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 6rem 2rem; text-align: center; color: var(--text-muted); }
        .empty-state h2 { color: var(--text-primary); font-size: 1.5rem; }
        .cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; align-items: start; }
        .cart-items-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; color: var(--text-muted); font-size: 0.9rem; }
        .clear-btn { background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.85rem; }
        .cart-row { display: flex; align-items: center; gap: 1.25rem; padding: 1.25rem; margin-bottom: 1rem; }
        .cart-row-img { width: 90px; height: 90px; object-fit: cover; border-radius: 10px; flex-shrink: 0; }
        .cart-row-info { flex: 1; min-width: 0; }
        .cart-row-brand { font-size: 0.7rem; font-weight: 700; color: var(--accent-blue); text-transform: uppercase; margin-bottom: 0.2rem; }
        .cart-row-name { display: block; font-weight: 600; color: var(--text-primary); text-decoration: none; margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cart-row-name:hover { color: var(--accent-blue); }
        .cart-row-price { font-size: 0.9rem; color: var(--text-muted); }
        .cart-row-controls { display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }
        .qty-box { display: flex; align-items: center; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
        .qty-box button { background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.5rem 0.75rem; font-size: 0.85rem; transition: var(--transition); }
        .qty-box button:hover:not(:disabled) { background: rgba(255,255,255,0.1); color: var(--text-primary); }
        .qty-box button:disabled { opacity: 0.3; cursor: not-allowed; }
        .qty-box span { padding: 0 0.75rem; font-weight: 600; }
        .cart-row-subtotal { font-weight: 700; color: var(--text-primary); min-width: 80px; text-align: right; }
        .row-delete { background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; padding: 0.4rem; border-radius: 6px; transition: var(--transition); }
        .row-delete:hover { color: #f87171; background: rgba(239,68,68,0.1); }
        .cart-summary-panel { padding: 2rem; position: sticky; top: 90px; }
        .cart-summary-panel h2 { font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.5rem; }
        .summary-lines { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem; }
        .summary-line { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-secondary); }
        .summary-line.total-line { color: var(--text-primary); font-weight: 700; font-size: 1.05rem; padding-top: 0.8rem; border-top: 1px dashed var(--border); }
        .text-green { color: #4ade80; font-weight: 600; }
        .checkout-big-btn { width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; }
        @media (max-width: 900px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-row-controls { flex-wrap: wrap; }
        }
        @media (max-width: 580px) {
          .cart-row { flex-wrap: wrap; }
          .cart-row-img { width: 70px; height: 70px; }
        }
      `}</style>
        </div>
    );
};

export default CartPage;
