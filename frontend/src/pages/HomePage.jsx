import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import appleLogo from '../assets/brands/apple.png';
import samsungLogo from '../assets/brands/samsung.png';
import oneplusLogo from '../assets/brands/oneplus.png';
import xiaomiLogo from '../assets/brands/xiaomi.svg';
import googleLogo from '../assets/brands/google.svg';

const brandLogos = [
    { name: 'Apple', img: appleLogo },
    { name: 'Samsung', img: samsungLogo },
    { name: 'OnePlus', img: oneplusLogo },
    { name: 'Xiaomi', img: xiaomiLogo },
    { name: 'Google', img: googleLogo },
];

    const features = [
    { icon: <FiTruck size={28} />, title: 'Free Shipping', desc: 'On orders above PKR 999', color: '#3b82f6' },
    { icon: <FiShield size={28} />, title: '1 Year Warranty', desc: 'Official manufacturer warranty', color: '#7c3aed' },
    { icon: <FiRefreshCw size={28} />, title: '7-Day Returns', desc: 'Hassle-free return policy', color: '#06b6d4' },
    { icon: <FiHeadphones size={28} />, title: '24/7 Support', desc: 'Always here to help you', color: '#ec4899' },
];

const HomePage = () => {
    const [featured, setFeatured] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = [
        { title: 'iPhone 17 Pro Max', subtitle: 'Titanium. So strong. So light. So Pro.', tag: 'NEW ARRIVAL', gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%)', image: '/assets/products/apple/iphone 17 pro max.jpeg', price: 'PKR 1,89,999', badge: '-5%' },
        { title: 'Galaxy S24 Ultra', subtitle: 'Galaxy AI is here. Intelligence to the extreme.', tag: 'BEST SELLER', gradient: 'linear-gradient(135deg, #1a1040 0%, #0d0d2b 100%)', image: '/assets/products/samsung/samsung-galaxy-s24-ultra.jpg', price: 'PKR 1,69,999', badge: '-6%' },
        { title: 'Galaxy A54 5G', subtitle: 'Amazing value with premium features and performance.', tag: 'POPULAR', gradient: 'linear-gradient(135deg, #1a2a4a 0%, #0a1a3a 100%)', image: '/assets/products/samsung/Galaxy-A54-5G-Media-Assets-Thumb.jpg', price: 'PKR 59,999', badge: '-8%' },
        { title: 'OnePlus 12', subtitle: "Speed that never settles — 100W SUPERVOOC.", tag: 'HOT DEAL', gradient: 'linear-gradient(135deg, #ff1744 0%, #ff5252 50%, #ff6e40 100%)', image: '/assets/products/oneplus/one plus.webp', price: 'PKR 64,999', badge: '-7%' },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [featRes, newRes] = await Promise.all([
                    axios.get('/api/products/featured'),
                    axios.get('/api/products?sort=newest'),
                ]);
                setFeatured(featRes.data);
                setNewArrivals(newRes.data.products?.slice(0, 4) || []);
            } catch { } finally {
                setLoading(false);
            }
        };
        fetchProducts();

        const timer = setInterval(() => setActiveSlide(p => (p + 1) % slides.length), 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero-section">
                <div className="hero-slides">
                    {slides.map((slide, i) => (
                        <div key={i} className={`hero-slide ${i === activeSlide ? 'active' : ''}`}
                            style={{ background: slide.gradient }}>
                            <div className="hero-bg-glow" />
                            <div className="container hero-content">
                                <motion.div className="hero-text"
                                    key={activeSlide}
                                    initial={{ opacity: 0, x: -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}>
                                    <span className="hero-tag">{slide.tag}</span>
                                    <h1 className="hero-title">{slide.title}</h1>
                                    <p className="hero-subtitle">{slide.subtitle}</p>
                                    <div className="hero-price">Starting from <strong>{slide.price}</strong></div>
                                    <div className="hero-actions">
                                        <Link to="/shop" className="btn btn-primary hero-btn">Shop Now <FiArrowRight /></Link>
                                        <Link to="/product" className="btn btn-ghost hero-btn">Learn More</Link>
                                    </div>
                                </motion.div>
                                <motion.div className="hero-phone-icon"
                                    key={`icon-${activeSlide}`}
                                    initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.7, type: 'spring' }}>
                                    <div className="phone-float">
                                        <img src={slides[activeSlide].image} alt={slides[activeSlide].title} className="hero-phone-image" />
                                        <span className="discount-badge">{slides[activeSlide].badge}</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Slide Indicators */}
                <div className="slide-dots">
                    {slides.map((_, i) => (
                        <button key={i} className={`dot ${i === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(i)} />
                    ))}
                </div>
            </section>

            {/* Features Bar */}
            <section className="features-bar">
                <div className="container">
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <motion.div className="feature-item" key={i}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <div className="feature-icon" style={{ color: f.color, background: `${f.color}15` }}>{f.icon}</div>
                                <div>
                                    <div className="feature-title">{f.title}</div>
                                    <div className="feature-desc">{f.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brands */}
            <section className="brands-section section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-eyebrow">Top Brands</span>
                        <h2 className="section-title">Shop by Brand</h2>
                        <p className="section-subtitle">Find your favourite brand's latest lineup</p>
                    </div>
                    <div className="brands-grid">
                        {brandLogos.map((b, i) => (
                            <motion.div key={b.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                <Link to={`/shop?brand=${b.name}`} className="brand-card card">
                                    {b.img ? (
                                        <img src={b.img} alt={b.name} style={{ width: 56, height: 28, objectFit: 'contain' }} />
                                    ) : (
                                        <span className="brand-emoji">{b.emoji}</span>
                                    )}
                                    <span className="brand-name">{b.name}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="products-section section">
                <div className="container">
                    <div className="section-header-row">
                        <div>
                            <span className="section-eyebrow">Hand-Picked</span>
                            <h2 className="section-title">Featured Phones</h2>
                        </div>
                        <Link to="/shop" className="btn btn-outline">View All <FiArrowRight /></Link>
                    </div>
                    {loading ? (
                        <div className="grid-products">
                            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '380px' }} />)}
                        </div>
                    ) : (
                        <div className="grid-products">
                            {featured.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* Promo Banner */}
            <section className="promo-section">
                <div className="container">
                    <div className="promo-card card">
                        <div className="promo-content">
                            <span className="promo-tag">Limited Time Offer</span>
                            <h2 className="promo-title">Up to <span className="gradient-text">50% OFF</span> on Select Models</h2>
                            <p className="promo-desc">Don't miss out on our biggest sale of the year. Shop now before stock runs out!</p>
                            <Link to="/shop?sort=price_asc" className="btn btn-primary">Grab the Deal <FiArrowRight /></Link>
                        </div>
                        <div className="promo-visual">
                            <div className="promo-emojis">
                                <span>📱</span><span>💰</span><span>🎉</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            {newArrivals.length > 0 && (
                <section className="products-section section">
                    <div className="container">
                        <div className="section-header-row">
                            <div>
                                <span className="section-eyebrow">Just Landed</span>
                                <h2 className="section-title">New Arrivals</h2>
                            </div>
                            <Link to="/shop?sort=newest" className="btn btn-outline">View All <FiArrowRight /></Link>
                        </div>
                        <div className="grid-products">
                            {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    </div>
                </section>
            )}

            <style>{`
        .home-page { padding-top: 70px; }
        /* Hero */
        .hero-section { position: relative; height: 90vh; min-height: 580px; overflow: hidden; background: linear-gradient(135deg, #0d1a35 0%, #1a0a35 50%, #0a1530 100%); }
        .hero-slides, .hero-slide { position: absolute; inset: 0; }
        .hero-slide { opacity: 0; transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; }
        .hero-slide.active { opacity: 1; }
        .hero-bg-glow { 
            position: absolute; 
            inset: 0; 
            background: 
                radial-gradient(ellipse 800px 400px at 70% 50%, rgba(59, 130, 246, 0.25) 0%, transparent 50%),
                radial-gradient(ellipse 600px 500px at 10% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%);
            animation: glow-shift 8s ease-in-out infinite;
        }
        @keyframes glow-shift {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        .hero-content { display: flex; align-items: center; justify-content: space-between; gap: 4rem; position: relative; z-index: 1; padding: 2rem; }
        .hero-text { flex: 1; position: relative; z-index: 3; }
        .hero-tag { 
            display: inline-block; 
            padding: 0.4rem 1.2rem; 
            border-radius: 99px; 
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(124, 58, 237, 0.15) 100%);
            border: 1px solid rgba(59, 130, 246, 0.5);
            color: #60a5fa; 
            font-size: 0.75rem; 
            font-weight: 700; 
            letter-spacing: 0.15em; 
            margin-bottom: 1.5rem;
            text-transform: uppercase;
            backdrop-filter: blur(10px);
        }
        .hero-title { 
            font-family: var(--font-heading); 
            font-size: clamp(2.5rem, 6vw, 4.2rem); 
            font-weight: 900; 
            color: #fff; 
            line-height: 1.1; 
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.02em;
        }
        .hero-subtitle { 
            font-size: 1.2rem; 
            color: rgba(255, 255, 255, 0.75); 
            margin-bottom: 1.5rem; 
            max-width: 480px;
            line-height: 1.6;
        }
        .hero-price { 
            font-size: 1.2rem; 
            color: rgba(255, 255, 255, 0.9); 
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .hero-price strong { 
            color: #60a5fa; 
            font-size: 1.5rem;
            font-weight: 800;
        }
        .hero-actions { 
            display: flex; 
            gap: 1.2rem; 
            flex-wrap: wrap;
        }
        .hero-btn { 
            padding: 1rem 2.5rem; 
            font-size: 1rem;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        .hero-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3);
        }
        .hero-phone-icon { 
            flex-shrink: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center;
            position: relative;
        }
        .hero-phone-icon::before {
            content: '';
            position: absolute;
            width: 420px;
            height: 420px;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            animation: pulse-ring 3s ease-out infinite;
        }
        @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.3); opacity: 0; }
        }
        .phone-float { 
            position: relative; 
            width: 360px; 
            height: 540px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            background: linear-gradient(135deg, rgba(25, 35, 60, 0.7) 0%, rgba(45, 35, 75, 0.7) 100%);
            border: 2px solid rgba(100, 150, 255, 0.6);
            border-radius: 45px;
            overflow: hidden;
            animation: float 5s ease-in-out infinite;
            box-shadow: 
                0 0 80px rgba(59, 130, 246, 0.4),
                0 20px 60px rgba(0, 0, 0, 0.7),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
            padding: 14px;
            backdrop-filter: blur(10px);
        }
        .phone-float::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
            border-radius: 40px;
            pointer-events: none;
        }
        .phone-float::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(100, 180, 255, 0.1) 0%, transparent 50%);
            border-radius: 40px;
            pointer-events: none;
        }
        .hero-phone-image { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
            object-position: center; 
            border-radius: 36px; 
            display: block;
            box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.4);
        }
        .discount-badge { 
            position: absolute; 
            top: 35px; 
            right: 35px; 
            background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
            color: #fff; 
            font-size: 1.1rem; 
            font-weight: 900; 
            padding: 0.7rem 1.2rem; 
            border-radius: 99px; 
            z-index: 10; 
            box-shadow: 0 12px 30px rgba(59, 130, 246, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        @keyframes float { 
            0%, 100% { transform: translateY(0) rotateZ(-0.5deg); } 
            50% { transform: translateY(-25px) rotateZ(0.5deg); } 
        }
        .slide-dots { 
            position: absolute; 
            bottom: 3rem; 
            left: 50%; 
            transform: translateX(-50%); 
            display: flex; 
            gap: 0.8rem; 
            z-index: 10;
        }
        .dot { 
            width: 10px; 
            height: 10px; 
            border-radius: 99px; 
            border: 2px solid rgba(255, 255, 255, 0.3);
            cursor: pointer; 
            background: rgba(255, 255, 255, 0.15);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 0;
        }
        .dot.active { 
            background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
            width: 30px;
            border-color: #60a5fa;
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }
        /* Features */
        .features-bar { background: var(--bg-secondary); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 2rem 0; }
        .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .feature-item { display: flex; align-items: center; gap: 1rem; }
        .feature-icon { width: 52px; height: 52px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .feature-title { font-weight: 600; font-size: 0.95rem; color: var(--text-primary); }
        .feature-desc { font-size: 0.8rem; color: var(--text-muted); }
        /* Section headers */
        .section-eyebrow { display: inline-block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-blue); margin-bottom: 0.4rem; }
        .section-header { text-align: center; margin-bottom: 3rem; }
        .section-header-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        /* Brands */
        .brands-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; }
        .brand-card { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2rem 1rem; text-decoration: none; }
        .brand-emoji { font-size: 2.5rem; }
        .brand-name { font-weight: 700; color: var(--text-secondary); font-size: 0.95rem; }
        /* Promo */
        .promo-section { padding: 3rem 0; }
        .promo-card { padding: 3rem; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #0d1a40 0%, #1a0a40 100%); border-color: rgba(99,102,241,0.2); gap: 2rem; overflow: hidden; }
        .promo-tag { display: inline-block; padding: 0.3rem 1rem; border-radius: 99px; background: rgba(124,58,237,0.2); border: 1px solid rgba(124,58,237,0.3); color: #a78bfa; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 1rem; }
        .promo-title { font-family: var(--font-heading); font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 800; color: #fff; margin-bottom: 0.75rem; }
        .promo-desc { color: rgba(255,255,255,0.65); margin-bottom: 1.5rem; max-width: 480px; }
        .promo-visual { flex-shrink: 0; }
        .promo-emojis { font-size: 4rem; display: flex; gap: 0.5rem; animation: float 3s ease-in-out infinite; }
        @media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2, 1fr); } .brands-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .hero-section { height: auto; padding: 4rem 0 2rem; }
          .hero-slides, .hero-slide { position: relative; inset: auto; }
          .hero-slide { display: none; } .hero-slide.active { display: flex; }
          .hero-content { flex-direction: column; text-align: center; gap: 2rem; padding: 1rem; }
          .hero-title { font-size: clamp(2rem, 4vw, 2.8rem); margin-bottom: 1rem; }
          .hero-subtitle { margin: 0 auto 1.5rem; font-size: 1rem; }
          .hero-actions { justify-content: center; }
          .hero-phone-icon::before { width: 300px; height: 300px; }
          .phone-float { width: 280px; height: 420px; padding: 10px; }
          .discount-badge { top: 20px; right: 20px; font-size: 0.9rem; padding: 0.5rem 1rem; }
          .slide-dots { bottom: 1.5rem; gap: 0.5rem; }
          .dot { width: 8px; height: 8px; }
          .dot.active { width: 24px; }
          .features-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .brands-grid { grid-template-columns: repeat(3, 1fr); }
          .promo-card { flex-direction: column; text-align: center; } 
          .promo-content { text-align: center; }
          .section-header-row { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .brands-grid { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
};

export default HomePage;
