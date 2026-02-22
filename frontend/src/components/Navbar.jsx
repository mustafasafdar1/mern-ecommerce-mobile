import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiSun, FiMoon, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cartCount, setIsCartOpen } = useCart();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setUserMenuOpen(false);
    }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?keyword=${searchQuery}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Shop', to: '/shop' },
        { label: 'Brands', to: '/shop?sort=rating' },
        { label: 'Deals', to: '/shop?sort=price_asc' },
    ];

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-inner">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon">📱</span>
                        <span className="logo-text">Mobile<span className="gradient-text">Zone</span></span>
                    </Link>

                    {/* Desktop Links */}
                    <ul className="nav-links">
                        {navLinks.map(l => (
                            <li key={l.to}>
                                <Link to={l.to} className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}>{l.label}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* Actions */}
                    <div className="nav-actions">
                        <button className="icon-btn" onClick={() => setSearchOpen(true)} title="Search"><FiSearch /></button>
                        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">{isDark ? <FiSun /> : <FiMoon />}</button>
                        {user?.role !== 'admin' && (
                            <button className="icon-btn cart-btn" onClick={() => setIsCartOpen(true)}>
                                <FiShoppingCart />
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </button>
                        )}
                        {user ? (
                            <div className="user-menu-wrap">
                                <button className="user-btn" onClick={() => setUserMenuOpen(p => !p)}>
                                    <div className="avatar">{user.name[0].toUpperCase()}</div>
                                    <span className="user-name">{user.name.split(' ')[0]}</span>
                                    <FiChevronDown className={userMenuOpen ? 'rotated' : ''} />
                                </button>
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div className="user-dropdown glass"
                                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <Link to="/profile" onClick={() => setUserMenuOpen(false)}><FiUser /> My Profile</Link>
                                            <Link to="/orders" onClick={() => setUserMenuOpen(false)}><FiShoppingCart /> My Orders</Link>
                                            {user.role === 'admin' && <Link to="/admin" onClick={() => setUserMenuOpen(false)}>🛠 Admin</Link>}
                                            <button onClick={logout}><FiLogOut /> Logout</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{ padding: '0.55rem 1.2rem', fontSize: '0.875rem' }}>Sign In</Link>
                        )}
                        <button className="icon-btn mobile-menu-btn" onClick={() => setMobileOpen(p => !p)}>
                            {mobileOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Search Modal */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div className="search-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSearchOpen(false)}>
                        <motion.div className="search-modal" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -30, opacity: 0 }} onClick={e => e.stopPropagation()}>
                            <form onSubmit={handleSearch}>
                                <FiSearch className="search-icon" />
                                <input autoFocus type="text" placeholder="Search phones, brands..." value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)} />
                                <button type="button" onClick={() => setSearchOpen(false)}><FiX /></button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div className="mobile-menu glass"
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25 }}>
                        <div className="mobile-menu-header">
                            <span className="logo-text">Mobile<span className="gradient-text">Zone</span></span>
                            <button onClick={() => setMobileOpen(false)}><FiX /></button>
                        </div>
                        <ul>
                            {navLinks.map(l => (
                                <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
                            ))}
                            {user ? (
                                <>
                                    <li><Link to="/profile">My Profile</Link></li>
                                    <li><Link to="/orders">My Orders</Link></li>
                                    {user.role === 'admin' && <li><Link to="/admin">Admin Dashboard</Link></li>}
                                    <li><button onClick={logout} style={{ color: '#f87171' }}>Logout</button></li>
                                </>
                            ) : (
                                <li><Link to="/login" className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>Sign In / Register</Link></li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 1rem 0;
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(8, 12, 24, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 0.6rem 0;
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }
        .light-mode .navbar.scrolled {
          background: rgba(248,250,252,0.95);
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .navbar-inner { display: flex; align-items: center; gap: 2rem; }
        .navbar-logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
        .logo-icon { font-size: 1.5rem; }
        .logo-text { font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--text-primary); }
        .nav-links { display: flex; list-style: none; gap: 0.25rem; margin: 0 auto; }
        .nav-link { display: block; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; color: var(--text-secondary); font-weight: 500; transition: var(--transition); }
        .nav-link:hover, .nav-link.active { color: var(--text-primary); background: rgba(255,255,255,0.07); }
        .nav-actions { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
        .icon-btn { background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.5rem; border-radius: 8px; font-size: 1.1rem; display: flex; align-items: center; transition: var(--transition); }
        .icon-btn:hover { color: var(--text-primary); background: rgba(255,255,255,0.07); }
        .cart-btn { position: relative; }
        .cart-badge { position: absolute; top: 2px; right: 2px; background: var(--gradient-primary); color: #fff; font-size: 0.65rem; font-weight: 700; min-width: 16px; height: 16px; border-radius: 99px; display: flex; align-items: center; justify-content: center; }
        .user-menu-wrap { position: relative; }
        .user-btn { display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 99px; padding: 0.4rem 0.9rem 0.4rem 0.4rem; cursor: pointer; color: var(--text-primary); transition: var(--transition); }
        .user-btn:hover { border-color: var(--accent-blue); }
        .avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; color: #fff; }
        .user-name { font-size: 0.875rem; font-weight: 500; }
        .rotated { transform: rotate(180deg); }
        .user-dropdown { position: absolute; top: calc(100% + 8px); right: 0; min-width: 180px; border-radius: var(--radius-md); padding: 0.5rem; display: flex; flex-direction: column; gap: 0.2rem; z-index: 1001; }
        .user-dropdown a, .user-dropdown button { display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 0.9rem; text-decoration: none; color: var(--text-secondary); border-radius: 8px; font-size: 0.875rem; background: none; border: none; cursor: pointer; width: 100%; transition: var(--transition); }
        .user-dropdown a:hover, .user-dropdown button:hover { background: rgba(255,255,255,0.07); color: var(--text-primary); }
        .mobile-menu-btn { display: none; }
        .search-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 2000; display: flex; align-items: flex-start; justify-content: center; padding-top: 6rem; }
        .search-modal { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1rem 1.25rem; width: 100%; max-width: 560px; margin: 0 1rem; }
        .search-modal form { display: flex; align-items: center; gap: 0.75rem; }
        .search-modal .search-icon { font-size: 1.1rem; color: var(--text-muted); flex-shrink: 0; }
        .search-modal input { flex: 1; background: none; border: none; outline: none; color: var(--text-primary); font-size: 1.1rem; font-family: var(--font-primary); }
        .search-modal button { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.1rem; display: flex; }
        .mobile-menu { position: fixed; top: 0; right: 0; bottom: 0; width: min(300px, 85vw); z-index: 1500; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .mobile-menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .mobile-menu-header button { background: none; border: none; color: var(--text-primary); font-size: 1.4rem; cursor: pointer; }
        .mobile-menu ul { list-style: none; display: flex; flex-direction: column; gap: 0.25rem; }
        .mobile-menu li a, .mobile-menu li button { display: block; padding: 0.85rem 1rem; color: var(--text-secondary); text-decoration: none; font-size: 1rem; font-weight: 500; border-radius: var(--radius-sm); transition: var(--transition); background: none; border: none; cursor: pointer; width: 100%; text-align: left; }
        .mobile-menu li a:hover, .mobile-menu li button:hover { color: var(--text-primary); background: rgba(255,255,255,0.07); }
        @media (max-width: 768px) {
          .nav-links, .user-name { display: none; }
          .mobile-menu-btn { display: flex; }
          .nav-actions .btn { display: none; }
        }
      `}</style>
        </>
    );
};

export default Navbar;
