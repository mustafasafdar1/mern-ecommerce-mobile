import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                const data = await login(email, password);
                if (selectedRole === 'admin' && data?.role !== 'admin') {
                    alert('You do not have admin access. Please use correct admin credentials.');
                    setLoading(false);
                    return;
                }
                if (data?.role === 'admin') navigate('/admin');
                else navigate('/');
            } else {
                const data = await register(name, email, password);
                if (data?.role === 'admin') navigate('/admin');
                else navigate('/');
            }
        } catch {
            // toast handled in context
        } finally {
            setLoading(false);
        }
    };

    const handleRoleSelection = (role) => {
        setSelectedRole(role);
        if (role === 'user') {
            setEmail('');
            setPassword('');
            setName('');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-glow auth-glow-1" />
                <div className="auth-glow auth-glow-2" />
            </div>

            {!selectedRole && (
                <div className="role-selection-modal">
                    <motion.div className="role-selection-card card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}>
                        <div className="role-selection-header">
                            <h2>Select Login Type</h2>
                            <p>Choose how you want to access the Mobile Shop</p>
                        </div>
                        <div className="role-buttons">
                            <motion.button
                                className="role-btn admin-role"
                                onClick={() => handleRoleSelection('admin')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}>
                                <span className="role-icon">👨‍💼</span>
                                <span className="role-title">Admin Login</span>
                                <span className="role-desc">Manage products & orders</span>
                            </motion.button>
                            <motion.button
                                className="role-btn user-role"
                                onClick={() => handleRoleSelection('user')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}>
                                <span className="role-icon">👤</span>
                                <span className="role-title">User Login</span>
                                <span className="role-desc">Browse & shop products</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="auth-container">
                <motion.div className="auth-card card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}>

                    {/* Logo */}
                    <div className="auth-logo">
                        <span>📱</span>
                        <span className="auth-logo-text">Mobile<span className="gradient-text">Zone</span></span>
                    </div>

                    {/* Tabs */}
                    <div className="auth-tabs">
                        <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Sign In</button>
                        <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form key={isLogin ? 'login' : 'register'} onSubmit={handleSubmit}
                            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                            transition={{ duration: 0.25 }}>

                            {!isLogin && (
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <div className="input-wrap">
                                        <FiUser className="input-icon" />
                                        <input className="form-input input-with-icon" type="text" placeholder="John Doe"
                                            value={name} onChange={e => setName(e.target.value)} required />
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <div className="input-wrap">
                                    <FiMail className="input-icon" />
                                    <input className="form-input input-with-icon" type="email" placeholder="you@email.com"
                                        value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-wrap">
                                    <FiLock className="input-icon" />
                                    <input className="form-input input-with-icon input-with-action" type={showPass ? 'text' : 'password'}
                                        placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                                    <button type="button" className="input-action" onClick={() => setShowPass(p => !p)}>
                                        {showPass ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            {isLogin && (
                                <div className="forgot-wrap">
                                    <a href="#" className="forgot-link">Forgot password?</a>
                                </div>
                            )}

                            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
                                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                            </button>

                            {selectedRole && (
                                <div className="role-info">
                                    <p>Logging in as: <strong>{selectedRole === 'admin' ? 'Administrator' : 'User'}</strong></p>
                                    <button type="button" className="change-role-btn" onClick={() => setSelectedRole(null)}>
                                        Change Role
                                    </button>
                                </div>
                            )}

                            {/* Demo session removed per request */}
                        </motion.form>
                    </AnimatePresence>
                </motion.div>
            </div>

            <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; padding: 2rem 1rem; }
        .auth-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .auth-glow { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
        .auth-glow-1 { width: 400px; height: 400px; background: #3b82f6; top: 10%; left: 20%; }
        .auth-glow-2 { width: 300px; height: 300px; background: #7c3aed; bottom: 10%; right: 20%; }
        .auth-container { width: 100%; max-width: 440px; position: relative; z-index: 1; }
        .auth-card { padding: 2.5rem; }
        .auth-logo { display: flex; align-items: center; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; }
        .auth-logo span:first-child { font-size: 2rem; }
        .auth-logo-text { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); }
        .auth-tabs { display: flex; background: var(--bg-secondary); border-radius: var(--radius-md); padding: 4px; margin-bottom: 1.75rem; }
        .auth-tab { flex: 1; padding: 0.65rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; background: transparent; color: var(--text-muted); transition: var(--transition); }
        .auth-tab.active { background: var(--gradient-primary); color: #fff; }
        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.9rem; pointer-events: none; }
        .input-with-icon { padding-left: 2.6rem; }
        .input-with-action { padding-right: 2.6rem; }
        .input-action { position: absolute; right: 0.9rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.95rem; display: flex; transition: var(--transition); }
        .input-action:hover { color: var(--text-primary); }
        .forgot-wrap { text-align: right; margin: -0.5rem 0 0.75rem; }
        .forgot-link { font-size: 0.85rem; color: var(--accent-blue); text-decoration: none; }
        .auth-submit { width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; margin-top: 0.5rem; }
        .role-info { margin-top: 1.25rem; padding: 1rem; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); border-radius: var(--radius-sm); text-align: center; }
        .role-info p { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.6rem; }
        .change-role-btn { background: none; border: none; color: var(--accent-blue); cursor: pointer; font-size: 0.85rem; text-decoration: underline; padding: 0; }
        .change-role-btn:hover { color: #60a5fa; }
        .role-selection-modal { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 100; padding: 2rem 1rem; }
        .role-selection-modal::before { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: -1; }
        .role-selection-card { padding: 3rem; max-width: 500px; width: 100%; }
        .role-selection-header { text-align: center; margin-bottom: 2rem; }
        .role-selection-header h2 { font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-primary); }
        .role-selection-header p { font-size: 0.95rem; color: var(--text-muted); }
        .role-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .role-btn { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2rem 1.5rem; border: 2px solid var(--border); border-radius: var(--radius-md); background: rgba(255,255,255,0.02); cursor: pointer; transition: var(--transition); }
        .role-btn:hover { border-color: var(--accent-blue); background: rgba(59,130,246,0.08); }
        .role-btn.admin-role:hover { border-color: #7c3aed; background: rgba(124,58,237,0.08); }
        .role-btn.user-role:hover { border-color: #06b6d4; background: rgba(6,182,212,0.08); }
        .role-icon { font-size: 3rem; }
        .role-title { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
        .role-desc { font-size: 0.8rem; color: var(--text-muted); }
                @media (max-width: 640px) {
                    .auth-card { padding: 1.25rem; }
                    .auth-container { max-width: 360px; }
                    .auth-glow-1, .auth-glow-2 { display: none; }
                    .auth-logo-text { font-size: 1.15rem; }
                    .auth-tabs { margin-bottom: 1rem; }
                    .auth-submit { padding: 0.8rem; }
                    .role-selection-card { padding: 1.5rem; }
                    .role-buttons { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
