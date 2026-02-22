import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-glow" />
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span>📱</span>
                            <span className="logo-text">Mobile<span className="gradient-text">Zone</span></span>
                        </div>
                        <p className="footer-tagline">Your premium destination for the latest smartphones. Explore top brands at the best prices.</p>
                        <div className="social-links">
                            <a href="#" aria-label="Instagram"><FiInstagram /></a>
                            <a href="#" aria-label="Twitter"><FiTwitter /></a>
                            <a href="#" aria-label="Facebook"><FiFacebook /></a>
                            <a href="#" aria-label="YouTube"><FiYoutube /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h4>Shop</h4>
                        <ul>
                            <li><Link to="/shop">All Phones</Link></li>
                            <li><Link to="/shop?brand=Apple">Apple / iPhone</Link></li>
                            <li><Link to="/shop?brand=Samsung">Samsung Galaxy</Link></li>
                            <li><Link to="/shop?brand=OnePlus">OnePlus</Link></li>
                            <li><Link to="/shop?brand=Xiaomi">Xiaomi</Link></li>
                            <li><Link to="/shop?brand=Google">Google Pixel</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Return Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <div className="contact-info">
                            <div className="contact-item">
                                <FiMapPin />
                                <span>University of Central Punjab, Gujranwala, Pakistan</span>
                            </div>
                            <div className="contact-item">
                                <FiPhone />
                                <a href="tel:+925555555555">+92 55 5555 5555</a>
                            </div>
                            <div className="contact-item">
                                <FiMail />
                                <a href="mailto:support@mobilezone.pk">support@mobilezone.pk</a>
                            </div>
                        </div>

                        <h4 style={{ marginTop: '1.5rem' }}>Newsletter</h4>
                        <div className="newsletter-form">
                            <input type="email" placeholder="your@email.com" />
                            <button className="btn btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}>Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} MobileZone. All rights reserved.</p>
                    <div className="payment-icons">
                        <span>💳</span><span>🔒</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Secure Payments</span>
                    </div>
                </div>
            </div>

            <style>{`
        .footer { position: relative; background: var(--bg-secondary); border-top: 1px solid var(--border); padding: 4rem 0 0; overflow: hidden; }
        .footer-glow { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 600px; height: 200px; background: var(--gradient-glow); pointer-events: none; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 3rem; margin-bottom: 3rem; }
        .footer-brand { }
        .footer-logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; margin-bottom: 1rem; }
        .footer-logo .logo-text { font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--text-primary); }
        .footer-tagline { color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.5rem; }
        .social-links { display: flex; gap: 0.75rem; }
        .social-links a { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: var(--text-secondary); text-decoration: none; font-size: 1rem; transition: var(--transition); }
        .social-links a:hover { background: var(--gradient-primary); border-color: transparent; color: #fff; transform: translateY(-3px); }
        .footer-col h4 { font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem; }
        .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; }
        .footer-col ul li a { text-decoration: none; color: var(--text-muted); font-size: 0.9rem; transition: var(--transition); }
        .footer-col ul li a:hover { color: var(--accent-blue); padding-left: 4px; }
        .contact-info { display: flex; flex-direction: column; gap: 0.75rem; }
        .contact-item { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.875rem; color: var(--text-muted); }
        .contact-item svg { flex-shrink: 0; margin-top: 2px; color: var(--accent-blue); }
        .contact-item a { color: var(--text-muted); text-decoration: none; transition: var(--transition); }
        .contact-item a:hover { color: var(--accent-blue); }
        .newsletter-form { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
        .newsletter-form input { flex: 1; background: var(--bg-primary); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.6rem 0.9rem; color: var(--text-primary); font-size: 0.85rem; outline: none; min-width: 0; }
        .newsletter-form input:focus { border-color: var(--accent-blue); }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; border-top: 1px solid var(--border); }
        .footer-bottom p { font-size: 0.875rem; color: var(--text-muted); }
        .payment-icons { display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; }
        @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 640px) { .footer-grid { grid-template-columns: 1fr; gap: 2rem; } .footer-bottom { flex-direction: column; gap: 0.75rem; text-align: center; } }
      `}</style>
        </footer>
    );
};

export default Footer;
