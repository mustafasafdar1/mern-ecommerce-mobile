import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiArrowLeft, FiCheckCircle, FiTruck, FiShield } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StarRating = ({ rating, interactive, onRate }) => (
    <div className="stars" style={{ cursor: interactive ? 'pointer' : 'default' }}>
        {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className={s <= Math.round(rating) ? 'star' : 'star-empty'}
                onClick={() => interactive && onRate && onRate(s)}>★</span>
        ))}
    </div>
);

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(0);
    const [qty, setQty] = useState(1);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { addToCart } = useCart();
    const { user, authHeader } = useAuth();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
            } catch { } finally { setLoading(false); }
        };
        fetch();
    }, [id]);

    const handleReview = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please sign in to write a review');
        setSubmitting(true);
        try {
            await axios.post(`/api/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment }, { headers: authHeader() });
            toast.success('Review submitted!');
            setReviewComment('');
            const { data } = await axios.get(`/api/products/${id}`);
            setProduct(data);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Error submitting review');
        } finally { setSubmitting(false); }
    };

    if (loading) return (
        <div style={{ padding: '120px 0', textAlign: 'center' }}><div className="spinner" /></div>
    );
    if (!product) return (
        <div style={{ padding: '120px 2rem', textAlign: 'center' }}>
            <h2>Product not found</h2>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
        </div>
    );

    const fmt = (p) => `PKR ${Number(p || 0).toLocaleString('en-US')}`;

    return (
        <div className="product-detail-page">
            <div className="container">
                <Link to="/shop" className="back-link"><FiArrowLeft /> Back to Shop</Link>

                <div className="product-detail-grid">
                    {/* Images */}
                    <div className="product-images">
                        <motion.div className="main-image-wrap"
                            key={selectedImg}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <img src={(product.images?.[selectedImg] || product.images?.[0] || product.mobileImages?.[0] || 'https://via.placeholder.com/800x800?text=No+Image')}
                                alt={product.name} className="main-image" onError={(e) => { e.target.onerror = null; e.target.src = product.mobileImages?.[0] || 'https://via.placeholder.com/800x800?text=No+Image'; }} />
                        </motion.div>
                        {(product.images?.length > 1 || product.mobileImages?.length > 0) && (
                            <div className="image-thumbs">
                                {(product.images?.length > 0 ? product.images : product.mobileImages).map((img, i) => (
                                    <button key={i} className={`thumb ${i === selectedImg ? 'active' : ''}`} onClick={() => setSelectedImg(i)}>
                                        <img src={img} alt="" onError={(e) => { e.target.onerror = null; e.target.src = product.mobileImages?.[0] || 'https://via.placeholder.com/120x120?text=No'; }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="product-details">
                        <div className="detail-brand">{product.brand}</div>
                        <h1 className="detail-name">{product.name}</h1>

                        <div className="detail-rating">
                            <StarRating rating={product.rating} />
                            <span className="rating-num">{product.rating?.toFixed(1)}</span>
                            <span className="rating-count">({product.numReviews} reviews)</span>
                        </div>

                        <div className="detail-price">
                            <span className="detail-price-current">{fmt(product.price)}</span>
                            {product.originalPrice > product.price && (
                                <>
                                    <span className="detail-price-original">{fmt(product.originalPrice)}</span>
                                    <span className="badge badge-red">{product.discount}% OFF</span>
                                </>
                            )}
                        </div>

                        <p className="detail-description">{product.description}</p>

                        {/* Specs Grid */}
                        {product.specs && (
                            <div className="specs-grid">
                                {Object.entries(product.specs).filter(([k, v]) => v && k !== 'color').map(([key, val]) => (
                                    <div key={key} className="spec-item">
                                        <span className="spec-key">{key}</span>
                                        <span className="spec-val">{val}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Colors */}
                        {product.specs?.color?.length > 0 && (
                            <div className="color-section">
                                <span className="spec-key">Colors: </span>
                                <div className="color-chips">
                                    {product.specs.color.map(c => <span key={c} className="color-chip">{c}</span>)}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart (hidden for admins) */}
                        {user?.role === 'admin' ? (
                            <div className="admin-block card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                                <strong>Admin Account:</strong> Shopping is disabled for admin users. Go to the <a href="/admin">Admin Dashboard</a> to manage products and orders.
                            </div>
                        ) : (
                            <div className="buy-section">
                                <div className="qty-controls-big">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                                    <span>{qty}</span>
                                    <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}>+</button>
                                </div>
                                <button className="btn btn-primary buy-btn" onClick={() => addToCart(product, qty)}
                                    disabled={product.countInStock === 0}>
                                    <FiShoppingCart />
                                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="trust-row">
                            <div className="trust-item"><FiTruck /> Free shipping</div>
                            <div className="trust-item"><FiShield /> 1 Year Warranty</div>
                            <div className="trust-item"><FiCheckCircle /> 7-Day Returns</div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2 className="section-title">Customer Reviews</h2>

                    {/* Write Review */}
                    <div className="write-review card">
                        <h3>Write a Review</h3>
                        <form onSubmit={handleReview}>
                            <div className="form-group">
                                <label className="form-label">Your Rating</label>
                                <StarRating rating={reviewRating} interactive onRate={setReviewRating} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Your Review</label>
                                <textarea className="form-input" rows={4} placeholder="Share your experience..."
                                    value={reviewComment} onChange={e => setReviewComment(e.target.value)} required />
                            </div>
                            <button className="btn btn-primary" type="submit" disabled={submitting || !user}>
                                {!user ? 'Sign in to Review' : submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>

                    {/* Reviews List */}
                    <div className="reviews-list">
                        {product.reviews?.length === 0 ? (
                            <p className="no-reviews">No reviews yet. Be the first!</p>
                        ) : product.reviews?.map(r => (
                            <div key={r._id} className="review-card card">
                                <div className="review-header">
                                    <div className="review-avatar">{r.name?.[0]?.toUpperCase()}</div>
                                    <div>
                                        <div className="review-name">{r.name}</div>
                                        <StarRating rating={r.rating} />
                                    </div>
                                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="review-comment">{r.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .product-detail-page { padding: 100px 0 4rem; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; margin-bottom: 2rem; font-size: 0.9rem; transition: var(--transition); }
        .back-link:hover { color: var(--accent-blue); }
        .product-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-bottom: 4rem; }
        .main-image-wrap { background: var(--bg-secondary); border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 1; border: 1px solid var(--border); }
        .main-image { width: 100%; height: 100%; object-fit: cover; }
        .image-thumbs { display: flex; gap: 0.75rem; margin-top: 1rem; }
        .thumb { background: var(--bg-secondary); border: 2px solid var(--border); border-radius: 8px; padding: 4px; cursor: pointer; width: 72px; height: 72px; overflow: hidden; transition: var(--transition); }
        .thumb.active { border-color: var(--accent-blue); }
        .thumb img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
        .detail-brand { font-size: 0.8rem; font-weight: 700; color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .detail-name { font-family: var(--font-heading); font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 700; margin-bottom: 1rem; line-height: 1.25; }
        .detail-rating { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; }
        .rating-num { font-weight: 700; color: #f59e0b; }
        .rating-count { font-size: 0.875rem; color: var(--text-muted); }
        .detail-price { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .detail-price-current { font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-primary); }
        .detail-price-original { font-size: 1.1rem; color: var(--text-muted); text-decoration: line-through; }
        .detail-description { color: var(--text-secondary); line-height: 1.75; margin-bottom: 1.5rem; font-size: 0.95rem; }
        .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.25rem; background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem; border: 1px solid var(--border); }
        .spec-item { display: flex; flex-direction: column; gap: 0.15rem; }
        .spec-key { font-size: 0.72rem; color: var(--text-muted); text-transform: capitalize; font-weight: 600; }
        .spec-val { font-size: 0.85rem; color: var(--text-primary); font-weight: 500; }
        .color-section { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .color-chips { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .color-chip { padding: 0.2rem 0.65rem; border-radius: 99px; border: 1px solid var(--border); font-size: 0.75rem; color: var(--text-secondary); background: var(--bg-secondary); }
        .buy-section { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .qty-controls-big { display: flex; align-items: center; gap: 0; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
        .qty-controls-big button { background: none; border: none; color: var(--text-primary); cursor: pointer; padding: 0.75rem 1.1rem; font-size: 1.2rem; transition: var(--transition); }
        .qty-controls-big button:hover { background: rgba(255,255,255,0.1); }
        .qty-controls-big span { padding: 0 1rem; font-size: 1.05rem; font-weight: 600; min-width: 40px; text-align: center; }
        .buy-btn { padding: 0.85rem 2rem; font-size: 1rem; flex: 1; justify-content: center; }
        .trust-row { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .trust-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--text-muted); }
        .trust-item svg { color: var(--accent-blue); }
        .reviews-section { margin-top: 4rem; }
        .write-review { padding: 2rem; margin-bottom: 2rem; }
        .write-review h3 { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem; }
        .form-input[rows] { resize: vertical; min-height: 100px; }
        .reviews-list { display: flex; flex-direction: column; gap: 1rem; }
        .no-reviews { color: var(--text-muted); text-align: center; padding: 3rem; }
        .review-card { padding: 1.25rem 1.5rem; }
        .review-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem; }
        .review-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; flex-shrink: 0; }
        .review-name { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.2rem; }
        .review-date { margin-left: auto; font-size: 0.8rem; color: var(--text-muted); }
        .review-comment { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr; gap: 2rem; }
          .specs-grid { grid-template-columns: 1fr; }
          .trust-row { gap: 0.75rem; }
        }
      `}</style>
        </div>
    );
};

export default ProductDetailPage;
