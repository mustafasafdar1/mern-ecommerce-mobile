import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminPage = () => {
    const { user, authHeader } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name: '', brand: '', price: '', originalPrice: '', discount: '', description: '', countInStock: '', isFeatured: false, isNewArrival: false, images: '', mobileImages: '', outOfStock: false });

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/'); return; }
        fetchAll();
    }, [user]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [pRes, oRes, uRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/orders', { headers: authHeader() }),
                axios.get('/api/auth/users', { headers: authHeader() }),
            ]);
            setProducts(pRes.data.products);
            setOrders(oRes.data);
            setUsers(uRes.data);
            const revenue = oRes.data.reduce((a, o) => a + (o.totalPrice || 0), 0);
            setStats({ products: pRes.data.total, orders: oRes.data.length, users: uRes.data.length, revenue });
        } catch { } finally { setLoading(false); }
    };

    const getRevenueChartData = () => {
        const data = {};
        orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!data[date]) data[date] = 0;
            data[date] += order.totalPrice || 0;
        });
        const result = Object.entries(data).map(([date, revenue]) => ({ date, revenue: Math.round(revenue) })).slice(-7);
        return result.length > 0 ? result : [{ date: 'No Data', revenue: 0 }];
    };

    const getSalesChartData = () => {
        const data = {};
        orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!data[date]) data[date] = 0;
            data[date] += order.orderItems?.length || 1;
        });
        const result = Object.entries(data).map(([date, sales]) => ({ date, sales })).slice(-7);
        return result.length > 0 ? result : [{ date: 'No Data', sales: 0 }];
    };

    const getStatusDistribution = () => {
        const dist = {};
        orders.forEach(order => {
            dist[order.status] = (dist[order.status] || 0) + 1;
        });
        const result = Object.entries(dist).map(([name, value]) => ({ name, value }));
        return result.length > 0 ? result : [{ name: 'No Orders', value: 1 }];
    };

    const COLORS = ['#3b82f6', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await axios.delete(`/api/products/${id}`, { headers: authHeader() });
            setProducts(p => p.filter(x => x._id !== id));
            toast.success('Product deleted');
        } catch { toast.error('Failed to delete'); }
    };

    const handleAcceptOrder = async (id) => {
        try {
            const { data } = await axios.put(`/api/orders/${id}/status`, { status: 'Processing' }, { headers: authHeader() });
            setOrders(o => o.map(ord => ord._id === id ? data : ord));
            toast.success('Order accepted and status updated to Processing');
        } catch (err) { 
            console.error('Accept order error:', err);
            toast.error(err.response?.data?.message || 'Failed to accept order'); 
        }
    };

    const handleToggleOutOfStock = async (product) => {
        try {
            const res = await axios.put(`/api/products/${product._id}`, { outOfStock: !product.outOfStock }, { headers: authHeader() });
            const updated = res.data;
            setProducts(p => p.map(x => x._id === updated._id ? updated : x));
            toast.success('Product updated');
        } catch {
            toast.error('Failed to update product');
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...productForm, price: Number(productForm.price), originalPrice: Number(productForm.originalPrice), discount: Number(productForm.discount), countInStock: Number(productForm.countInStock), images: productForm.images ? [productForm.images] : [], mobileImages: productForm.mobileImages ? [productForm.mobileImages] : [], outOfStock: Boolean(productForm.outOfStock) };
        try {
            if (editProduct) {
                await axios.put(`/api/products/${editProduct._id}`, payload, { headers: authHeader() });
                toast.success('Product updated');
            } else {
                await axios.post('/api/products', payload, { headers: authHeader() });
                toast.success('Product created');
            }
            fetchAll();
            setShowProductForm(false);
            setEditProduct(null);
            setProductForm({ name: '', brand: '', price: '', originalPrice: '', discount: '', description: '', countInStock: '', isFeatured: false, isNewArrival: false, images: '', mobileImages: '', outOfStock: false });
        } catch { toast.error('Failed to save product'); }
    };

    const statCards = [
        { label: 'Total Products', value: stats.products, icon: <FiShoppingBag />, color: '#3b82f6' },
        { label: 'Total Orders', value: stats.orders, icon: <FiPackage />, color: '#7c3aed' },
        { label: 'Total Users', value: stats.users, icon: <FiUsers />, color: '#06b6d4' },
        { label: 'Revenue', value: `PKR ${(stats.revenue || 0).toLocaleString('en-US')}`, icon: <FiDollarSign />, color: '#10b981' },
    ];

    const tabs = ['dashboard', 'products', 'orders', 'users'];

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1 className="page-title">Admin Dashboard</h1>
                    <div className="admin-tabs">
                        {tabs.map(t => (
                            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dashboard */}
                {tab === 'dashboard' && (
                    <div>
                        <div className="stat-grid">
                            {statCards.map(s => (
                                <motion.div key={s.label} className="stat-card card"
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className="stat-icon" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                                    <div className="stat-value">{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="charts-grid">
                            <motion.div className="chart-card card"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <h3>Revenue Trend (Last 7 Days)</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={getRevenueChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                                        <YAxis stroke="var(--text-muted)" fontSize={12} />
                                        <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} formatter={(value) => `PKR ${value.toLocaleString('en-US')}`} />
                                        <Legend />
                                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </motion.div>

                            <motion.div className="chart-card card"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <h3>Sales Volume (Last 7 Days)</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={getSalesChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                                        <YAxis stroke="var(--text-muted)" fontSize={12} />
                                        <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                                        <Legend />
                                        <Bar dataKey="sales" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>

                            <motion.div className="chart-card card"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <h3>Order Status Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={getStatusDistribution()} cx="50%" cy="50%" labelLine={false} label={({name, value}) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                                            {getStatusDistribution().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value} orders`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </motion.div>
                        </div>

                        <div className="admin-recent card">
                            <h2>Recent Orders</h2>
                            <table className="admin-table">
                                <thead><tr><th>Order ID</th><th>User</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                                <tbody>
                                    {orders.slice(0, 5).map(o => (
                                        <tr key={o._id}>
                                            <td className="mono">#{o._id.slice(-8).toUpperCase()}</td>
                                            <td>{o.user?.name || 'N/A'}</td>
                                            <td>PKR {Number(o.totalPrice || 0).toLocaleString('en-US')}</td>
                                            <td><span className={`badge ${o.status === 'Delivered' ? 'badge-green' : o.status === 'Shipped' ? 'badge-purple' : 'badge-blue'}`}>{o.status}</span></td>
                                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Products */}
                {tab === 'products' && (
                    <div>
                        <div className="tab-header">
                            <h2>Products ({products.length})</h2>
                            <button className="btn btn-primary" onClick={() => setShowProductForm(true)}><FiPlus /> Add Product</button>
                        </div>

                        {showProductForm && (
                            <div className="product-form-wrap card">
                                <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <form onSubmit={handleProductSubmit}>
                                    <div className="form-grid">
                                        <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} required /></div>
                                        <div className="form-group"><label className="form-label">Brand</label><input className="form-input" value={productForm.brand} onChange={e => setProductForm(p => ({ ...p, brand: e.target.value }))} required /></div>
                                        <div className="form-group"><label className="form-label">Price (PKR)</label><input className="form-input" type="number" value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))} required /></div>
                                        <div className="form-group"><label className="form-label">Original Price (PKR)</label><input className="form-input" type="number" value={productForm.originalPrice} onChange={e => setProductForm(p => ({ ...p, originalPrice: e.target.value }))} /></div>
                                        <div className="form-group"><label className="form-label">Discount %</label><input className="form-input" type="number" value={productForm.discount} onChange={e => setProductForm(p => ({ ...p, discount: e.target.value }))} /></div>
                                        <div className="form-group"><label className="form-label">Stock</label><input className="form-input" type="number" value={productForm.countInStock} onChange={e => setProductForm(p => ({ ...p, countInStock: e.target.value }))} required /></div>
                                        <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Image URL</label><input className="form-input" value={productForm.images} onChange={e => setProductForm(p => ({ ...p, images: e.target.value }))} placeholder="/assets/products/brand/image.jpg" /></div>
                                        {productForm.images && (
                                            <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                                <label className="form-label">Image Preview</label>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                                                    <img src={productForm.images} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                                </div>
                                            </div>
                                        )}
                                        <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Mobile Image URL (optional)</label><input className="form-input" value={productForm.mobileImages} onChange={e => setProductForm(p => ({ ...p, mobileImages: e.target.value }))} placeholder="/assets/products/brand/image-mobile.jpg" /></div>
                                        <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label"><input type="checkbox" checked={productForm.outOfStock} onChange={e => setProductForm(p => ({ ...p, outOfStock: e.target.checked }))} /> Mark Out of Stock</label></div>
                                        <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Description</label><textarea className="form-input" rows={3} value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} /></div>
                                        <div className="form-group checkbox-group">
                                            <label><input type="checkbox" checked={productForm.isFeatured} onChange={e => setProductForm(p => ({ ...p, isFeatured: e.target.checked }))} /> Featured</label>
                                            <label><input type="checkbox" checked={productForm.isNewArrival} onChange={e => setProductForm(p => ({ ...p, isNewArrival: e.target.checked }))} /> New Arrival</label>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                        <button className="btn btn-primary" type="submit">{editProduct ? 'Update' : 'Create'} Product</button>
                                        <button className="btn btn-ghost" type="button" onClick={() => { setShowProductForm(false); setEditProduct(null); }}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="admin-recent card">
                            <table className="admin-table">
                                <thead><tr><th>Image</th><th>Name</th><th>Brand</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p._id}>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <img src={p.images?.[0]} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                                                {p.mobileImages?.[0] && <img src={p.mobileImages?.[0]} alt="mobile" style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />}
                                            </td>
                                            <td>{p.name}</td>
                                            <td>{p.brand}</td>
                                            <td>PKR {Number(p.price || 0).toLocaleString('en-US')}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                    <span className={`badge ${p.countInStock > 0 ? 'badge-green' : 'badge-red'}`}>{p.countInStock}</span>
                                                    {p.outOfStock && <span className="badge" style={{ background: '#f87171', color: '#fff' }}>Out</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button className="table-btn" onClick={() => { setEditProduct(p); setProductForm({ name: p.name, brand: p.brand, price: p.price, originalPrice: p.originalPrice || '', discount: p.discount || '', description: p.description, countInStock: p.countInStock, isFeatured: p.isFeatured, isNewArrival: p.isNewArrival, images: p.images?.[0] || '', mobileImages: p.mobileImages?.[0] || '', outOfStock: p.outOfStock || false }); setShowProductForm(true); }}><FiEdit2 /></button>
                                                    <button className="table-btn" onClick={() => handleToggleOutOfStock(p)} title={p.outOfStock ? 'Mark In Stock' : 'Mark Out of Stock'} style={{ display: 'flex', alignItems: 'center' }}>{p.outOfStock ? 'In Stock' : 'Out'}</button>
                                                    <button className="table-btn danger" onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Orders */}
                {tab === 'orders' && (
                    <div className="admin-recent card">
                        <h2 style={{ marginBottom: '1.25rem' }}>All Orders ({orders.length})</h2>
                        <table className="admin-table">
                            <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o._id}>
                                        <td className="mono">#{o._id.slice(-8).toUpperCase()}</td>
                                        <td>{o.user?.name || 'N/A'}<br /><small style={{ color: 'var(--text-muted)' }}>{o.user?.email}</small></td>
                                        <td>{o.orderItems?.length}</td>
                                        <td>PKR {Number(o.totalPrice || 0).toLocaleString('en-US')}</td>
                                        <td><span className={`badge ${o.status === 'Delivered' ? 'badge-green' : o.status === 'Processing' ? 'badge-purple' : o.status === 'Shipped' ? 'badge-orange' : o.status === 'Cancelled' ? 'badge-red' : 'badge-blue'}`}>{o.status}</span></td>
                                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {o.status === 'Pending' && (
                                                <button 
                                                    className="btn btn-sm" 
                                                    style={{ background: 'var(--accent-green)', color: '#fff', fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                                                    onClick={() => handleAcceptOrder(o._id)}
                                                >
                                                    Accept
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Users */}
                {tab === 'users' && (
                    <div className="admin-recent card">
                        <h2 style={{ marginBottom: '1.25rem' }}>All Users ({users.length})</h2>
                        <table className="admin-table">
                            <thead><tr><th>Avatar</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td><div className="u-avatar">{u.name?.[0]?.toUpperCase()}</div></td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td><span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>{u.role}</span></td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
        .admin-page { padding: 100px 0 4rem; }
        .page-title { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; margin-bottom: 1.5rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
        .admin-tabs { display: flex; gap: 0.4rem; background: var(--bg-secondary); border-radius: var(--radius-md); padding: 4px; }
        .admin-tab { padding: 0.55rem 1.1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.875rem; background: transparent; color: var(--text-muted); transition: var(--transition); }
        .admin-tab.active { background: var(--gradient-primary); color: #fff; }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 2rem; }
        .stat-card { padding: 1.75rem; text-align: center; }
        .stat-icon { width: 52px; height: 52px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.3rem; }
        .stat-value { font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem; }
        .stat-label { font-size: 0.85rem; color: var(--text-muted); }
        .charts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
        .chart-card { padding: 1.5rem; }
        .chart-card h3 { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--text-primary); }
        .admin-recent { padding: 1.5rem; overflow-x: auto; }
        .admin-recent h2 { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem; }
        .admin-table { width: 100%; border-collapse: collapse; min-width: 600px; }
        .admin-table th { text-align: left; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding: 0.6rem 0.85rem; border-bottom: 1px solid var(--border); }
        .admin-table td { padding: 0.85rem; font-size: 0.875rem; color: var(--text-secondary); border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
        .admin-table tr:last-child td { border-bottom: none; }
        .mono { font-family: monospace; font-size: 0.8rem; }
        .u-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; color: #fff; }
        .tab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .tab-header h2 { font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; }
        .product-form-wrap { padding: 1.75rem; margin-bottom: 1.5rem; }
        .product-form-wrap h3 { font-family: var(--font-heading); font-weight: 700; margin-bottom: 1.25rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
        .checkbox-group { display: flex; gap: 1.5rem; align-items: center; }
        .checkbox-group label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem; color: var(--text-secondary); }
        .checkbox-group input[type="checkbox"] { accent-color: var(--accent-blue); width: 16px; height: 16px; }
        .table-btn { background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; padding: 0.4rem 0.6rem; color: var(--text-muted); transition: var(--transition); display: flex; }
        .table-btn:hover { background: rgba(255,255,255,0.12); color: var(--text-primary); }
        .table-btn.danger:hover { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.2); }
        @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } .charts-grid { grid-template-columns: 1fr; } .form-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 640px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } .admin-tabs { flex-wrap: wrap; } .charts-grid { grid-template-columns: 1fr; } .form-grid { grid-template-columns: 1fr; } .admin-header { flex-direction: column; } }
      `}</style>
        </div>
    );
};

export default AdminPage;
