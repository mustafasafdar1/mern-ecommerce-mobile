import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartDrawer = () => {
    const { cartItems, removeFromCart, updateQty, cartTotal, cartCount, isCartOpen, setIsCartOpen } = useCart();
    const { user } = useAuth();

    const fmt = (p) => `PKR ${Number(p || 0).toLocaleString('en-US')}`;

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div className="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)} />
                    <motion.aside className="cart-drawer glass"
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 200 }}>

                        <div className="cart-header">
                            <div>
                                <h2>Your Cart</h2>
                                <span className="cart-count-label">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                            </div>
                            <button className="close-btn" onClick={() => setIsCartOpen(false)}><FiX /></button>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="cart-empty">
                                <FiShoppingBag size={56} />
                                <h3>Your cart is empty</h3>
                                <p>Add some amazing phones to get started</p>
                                <Link to="/shop" className="btn btn-primary" onClick={() => setIsCartOpen(false)}>Browse Shop</Link>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cartItems.map(item => (
                                        <div key={item._id} className="cart-item">
                                            <img src={item.images?.[0] || item.mobileImages?.[0] || 'https://via.placeholder.com/150x150?text=No'} alt={item.name} className="cart-item-img" onError={(e)=>{e.target.onerror=null;e.target.src=item.mobileImages?.[0]||'https://via.placeholder.com/150x150?text=No'}} />
                                            <div className="cart-item-details">
                                                <div className="cart-item-brand">{item.brand}</div>
                                                <div className="cart-item-name">{item.name}</div>
                                                <div className="cart-item-price">{fmt(item.price)}</div>
                                                <div className="cart-item-controls">
                                                    <div className="qty-controls">
                                                        <button onClick={() => updateQty(item._id, item.qty - 1)}><FiMinus /></button>
                                                        <span>{item.qty}</span>
                                                        <button onClick={() => updateQty(item._id, item.qty + 1)} disabled={item.qty >= item.countInStock}><FiPlus /></button>
                                                    </div>
                                                    <span className="item-subtotal">{fmt(item.price * item.qty)}</span>
                                                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}><FiTrash2 /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-footer">
                                    <div className="cart-summary">
                                        <div className="summary-row"><span>Subtotal</span><span>{fmt(cartTotal)}</span></div>
                                        <div className="summary-row"><span>Shipping</span><span className="free-ship">FREE</span></div>
                                        <div className="summary-row total"><span>Total</span><span>{fmt(cartTotal)}</span></div>
                                    </div>
                                    {user?.role === 'admin' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Admin accounts cannot place orders.</div>
                                            <Link to="/admin" className="btn btn-ghost" onClick={() => setIsCartOpen(false)}>Go to Admin Dashboard</Link>
                                        </div>
                                    ) : (
                                        <>
                                            <Link to="/checkout" className="btn btn-primary checkout-btn" onClick={() => setIsCartOpen(false)}>
                                                Proceed to Checkout →
                                            </Link>
                                            <Link to="/cart" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} onClick={() => setIsCartOpen(false)}>
                                                View Full Cart
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.aside>
                </>
            )}
            <style>{`
        .cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1400; backdrop-filter: blur(4px); }
        .cart-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: min(420px, 100vw); z-index: 1500; display: flex; flex-direction: column; overflow: hidden; }
        .cart-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 1.5rem; border-bottom: 1px solid var(--border); }
        .cart-header h2 { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; }
        .cart-count-label { font-size: 0.8rem; color: var(--text-muted); }
        .close-btn { background: rgba(255,255,255,0.07); border: 1px solid var(--border); color: var(--text-primary); border-radius: 8px; padding: 0.5rem; cursor: pointer; font-size: 1.1rem; display: flex; transition: var(--transition); }
        .close-btn:hover { background: rgba(239,68,68,0.2); color: #f87171; }
        .cart-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 2rem; text-align: center; color: var(--text-muted); }
        .cart-empty h3 { color: var(--text-primary); font-size: 1.2rem; }
        .cart-empty p { font-size: 0.9rem; }
        .cart-items { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .cart-item { display: flex; gap: 1rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.85rem; }
        .cart-item-img { width: 72px; height: 72px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
        .cart-item-details { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.2rem; }
        .cart-item-brand { font-size: 0.7rem; color: var(--accent-blue); font-weight: 600; text-transform: uppercase; }
        .cart-item-name { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cart-item-price { font-size: 0.85rem; color: var(--text-secondary); }
        .cart-item-controls { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem; }
        .qty-controls { display: flex; align-items: center; gap: 0; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
        .qty-controls button { background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.3rem 0.6rem; font-size: 0.85rem; transition: var(--transition); }
        .qty-controls button:hover:not(:disabled) { background: rgba(255,255,255,0.1); color: var(--text-primary); }
        .qty-controls button:disabled { opacity: 0.3; }
        .qty-controls span { padding: 0 0.5rem; font-size: 0.875rem; font-weight: 600; min-width: 24px; text-align: center; }
        .item-subtotal { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-left: auto; }
        .remove-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0.3rem; display: flex; border-radius: 6px; transition: var(--transition); }
        .remove-btn:hover { color: #f87171; background: rgba(239,68,68,0.1); }
        .cart-footer { padding: 1.25rem 1.5rem; border-top: 1px solid var(--border); }
        .cart-summary { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem; }
        .summary-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-secondary); }
        .summary-row.total { color: var(--text-primary); font-weight: 700; font-size: 1.05rem; border-top: 1px solid var(--border); padding-top: 0.6rem; }
        .free-ship { color: #4ade80; font-weight: 600; }
        .checkout-btn { width: 100%; justify-content: center; padding: 0.85rem; font-size: 1rem; }
      `}</style>
        </AnimatePresence>
    );
};

export default CartDrawer;
