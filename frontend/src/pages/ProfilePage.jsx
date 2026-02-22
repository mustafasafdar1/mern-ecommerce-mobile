import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiEdit2, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, authHeader, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [tab, setTab] = useState('profile');
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', password: '' });

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        axios.get('/api/orders/myorders', { headers: authHeader() }).then(r => setOrders(r.data)).catch(() => { });
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/auth/profile', form, { headers: authHeader() });
            toast.success('Profile updated!');
            setEditing(false);
        } catch (err) { toast.error('Failed to update'); }
    };

    const statusColor = { Pending: 'bag-orange', Processing: 'badge-blue', Shipped: 'badge-purple', Delivered: 'badge-green', Cancelled: 'badge-red' };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-layout">
                    {/* Sidebar */}
                    <aside className="profile-sidebar card">
                        <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
                        <div className="profile-name">{user?.name}</div>
                        <div className="profile-email">{user?.email}</div>
                        {user?.role === 'admin' && <span className="badge badge-purple" style={{ margin: '0.5rem auto' }}>Admin</span>}
                        <div className="profile-nav">
                            <button className={`profile-nav-btn ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}><FiUser /> Profile</button>
                            <button className={`profile-nav-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}><FiPackage /> Orders<span className="orders-badge">{orders.length}</span></button>
                        </div>
                        <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', color: '#f87171' }} onClick={logout}>
                            Logout
                        </button>
                    </aside>

                    {/* Content */}
                    <main className="profile-main">
                        {tab === 'profile' && (
                            <motion.div className="profile-section card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="section-header-row">
                                    <h2>Personal Information</h2>
                                    <button className="btn btn-ghost" onClick={() => setEditing(p => !p)}>
                                        <FiEdit2 /> {editing ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                <form onSubmit={handleUpdate}>
                                    <div className="form-row-2">
                                        <div className="form-group">
                                            <label className="form-label">Full Name</label>
                                            <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} disabled={!editing} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={!editing} />
                                        </div>
                                    </div>
                                    <div className="form-row-2">
                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} disabled={!editing} placeholder="+91 98765 43210" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">New Password</label>
                                            <input className="form-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} disabled={!editing} placeholder="Leave blank to keep current" />
                                        </div>
                                    </div>
                                    {editing && <button className="btn btn-primary" type="submit"><FiSave /> Save Changes</button>}
                                </form>
                            </motion.div>
                        )}

                        {tab === 'orders' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>My Orders</h2>
                                {orders.length === 0 ? (
                                    <div className="no-orders card">
                                        <FiPackage size={48} />
                                        <p>No orders yet</p>
                                        <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
                                    </div>
                                ) : orders.map(order => (
                                    <div key={order._id} className="order-card card">
                                        <div className="order-card-header">
                                            <div>
                                                <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                                                <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            </div>
                                            <span className={`badge ${statusColor[order.status] || 'badge-blue'}`}>{order.status}</span>
                                        </div>
                                        <div className="order-items-preview">
                                            {order.orderItems?.slice(0, 3).map(item => (
                                                <img key={item._id} src={item.image} alt={item.name} className="order-thumb" />
                                            ))}
                                            {order.orderItems?.length > 3 && <span className="more-items">+{order.orderItems.length - 3}</span>}
                                        </div>
                                        <div className="order-card-footer">
                                            <span className="order-total">PKR {Number(order.totalPrice || 0).toLocaleString('en-US')}</span>
                                            <span className="order-payment">{order.paymentMethod}</span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>

            <style>{`
        .profile-page { padding: 100px 0 4rem; }
        .profile-layout { display: grid; grid-template-columns: 260px 1fr; gap: 2rem; align-items: start; }
        .profile-sidebar { padding: 2rem; text-align: center; position: sticky; top: 90px; }
        .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; color: #fff; margin: 0 auto 1rem; }
        .profile-name { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem; }
        .profile-email { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; }
        .profile-nav { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 1rem; }
        .profile-nav-btn { display: flex; align-items: center; gap: 0.6rem; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: none; background: none; cursor: pointer; color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; transition: var(--transition); width: 100%; }
        .profile-nav-btn:hover { background: rgba(255,255,255,0.07); color: var(--text-primary); }
        .profile-nav-btn.active { background: rgba(59,130,246,0.12); color: var(--accent-blue); }
        .orders-badge { margin-left: auto; background: var(--gradient-primary); color: #fff; font-size: 0.7rem; font-weight: 700; padding: 0.1rem 0.5rem; border-radius: 99px; }
        .profile-section { padding: 2rem; }
        .section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .section-header-row h2 { font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .no-orders { padding: 3rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-muted); }
        .order-card { padding: 1.25rem; margin-bottom: 1rem; }
        .order-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .order-id { font-weight: 700; font-size: 0.9rem; font-family: monospace; margin-bottom: 0.2rem; }
        .order-date { font-size: 0.8rem; color: var(--text-muted); }
        .order-items-preview { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center; }
        .order-thumb { width: 52px; height: 52px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); }
        .more-items { font-size: 0.8rem; color: var(--text-muted); }
        .order-card-footer { display: flex; justify-content: space-between; }
        .order-total { font-weight: 700; font-size: 0.95rem; }
        .order-payment { font-size: 0.8rem; color: var(--text-muted); }
        @media (max-width: 768px) {
          .profile-layout { grid-template-columns: 1fr; }
          .profile-sidebar { position: static; }
          .form-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
};

export default ProfilePage;
