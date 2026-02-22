import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiHeart, FiEdit2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ rating }) => (
    <div className="stars">
        {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className={s <= Math.round(rating) ? 'star' : 'star-empty'}>★</span>
        ))}
    </div>
);

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();

    const formatPrice = (p) => `PKR ${Number(p || 0).toLocaleString('en-US')}`;

    const getBrandLogo = (brand) => {
        const brandLogos = {
            'apple': '/src/assets/brands/apple.png',
            'samsung': '/src/assets/brands/samsung.png',
            'oneplus': '/src/assets/brands/oneplus.png',
            'xiaomi': '/src/assets/brands/xiaomi.svg',
            'google': '/src/assets/brands/google.svg'
        };
        return brandLogos[brand.toLowerCase()] || null;
    };

    return (
        <motion.div className="product-card card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}>
            <Link to={`/product/${product._id}`} className="product-card-link">
                <div className="product-image-wrap">
                    <img
                        src={product.images?.[0] || product.mobileImages?.[0] || 'https://via.placeholder.com/600x600?text=No+Image'}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            const fallback = product.mobileImages?.[0] || 'https://via.placeholder.com/600x600?text=No+Image';
                            e.target.src = fallback;
                        }}
                    />
                    {/* Badges */}
                    <div className="product-badges">
                        {product.isNewArrival && <span className="badge badge-blue">New</span>}
                        {product.discount > 0 && <span className="badge badge-red">-{product.discount}%</span>}
                        {product.countInStock === 0 && <span className="badge badge-orange">Out of Stock</span>}
                    </div>
                    <button className="wishlist-btn" onClick={e => { e.preventDefault(); }}><FiHeart /></button>
                </div>

                <div className="product-info">
                    <div className="product-brand-wrap">
                        {getBrandLogo(product.brand) && (
                            <img src={getBrandLogo(product.brand)} alt={product.brand} className="brand-logo" />
                        )}
                        <div className="product-brand">{product.brand}</div>
                    </div>
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-meta">
                        <StarRating rating={product.rating} />
                        <span className="reviews-count">({product.numReviews})</span>
                    </div>

                    <div className="product-specs">
                        {product.specs?.ram && <span>{product.specs.ram}</span>}
                        {product.specs?.storage && <span>{product.specs.storage?.split('/')[0].trim()}</span>}
                    </div>

                    <div className="product-price">
                        <span className="price-current">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                            <span className="price-original">{formatPrice(product.originalPrice)}</span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="product-card-footer">
                {user?.role === 'admin' ? (
                    <Link to="/admin" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                        <FiEdit2 /> Manage
                    </Link>
                ) : (
                    <button
                        className="btn btn-primary add-cart-btn"
                        onClick={() => addToCart(product)}
                        disabled={product.countInStock === 0}>
                        <FiShoppingCart />
                        {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                )}
            </div>

            <style>{`
        .product-card { overflow: hidden; display: flex; flex-direction: column; }
        .product-card-link { text-decoration: none; color: inherit; flex: 1; }
        .product-image-wrap { position: relative; background: linear-gradient(135deg, #0d1526, #1a1040); aspect-ratio: 1/1; overflow: hidden; }
        .product-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .product-card:hover .product-image { transform: scale(1.05); }
        .product-badges { position: absolute; top: 0.75rem; left: 0.75rem; display: flex; flex-direction: column; gap: 0.3rem; }
        .wishlist-btn { position: absolute; top: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.4); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); transition: var(--transition); }
        .wishlist-btn:hover { background: rgba(239,68,68,0.8); }
        .product-info { padding: 1rem; }
        .product-brand-wrap { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem; }
        .brand-logo { height: 20px; width: auto; object-fit: contain; }
        .product-brand { font-size: 0.75rem; font-weight: 600; color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; }
        .product-name { font-family: var(--font-heading); font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .product-meta { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.5rem; }
        .reviews-count { font-size: 0.75rem; color: var(--text-muted); }
        .product-specs { display: flex; gap: 0.4rem; margin-bottom: 0.6rem; flex-wrap: wrap; }
        .product-specs span { font-size: 0.7rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 4px; padding: 0.15rem 0.45rem; color: var(--text-muted); }
        .product-price { display: flex; align-items: baseline; gap: 0.6rem; }
        .price-current { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); }
        .price-original { font-size: 0.85rem; color: var(--text-muted); text-decoration: line-through; }
        .product-card-footer { padding: 0.75rem 1rem 1rem; }
        .add-cart-btn { width: 100%; justify-content: center; padding: 0.65rem; font-size: 0.875rem; }
        .add-cart-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 768px) {
          .product-name { font-size: 0.85rem; }
          .price-current { font-size: 1rem; }
        }
      `}</style>
        </motion.div>
    );
};

export default ProductCard;
