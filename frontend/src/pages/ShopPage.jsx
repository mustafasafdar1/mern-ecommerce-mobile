import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Google'];
const SORTS = [
    { value: '', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
];

const ShopPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const keyword = searchParams.get('keyword') || '';
    const brand = searchParams.get('brand') || '';
    const sort = searchParams.get('sort') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    const [localMin, setLocalMin] = useState(minPrice || '0');
    const [localMax, setLocalMax] = useState(maxPrice || '300000');
    const [selectedBrand, setSelectedBrand] = useState(brand);
    const [selectedSort, setSelectedSort] = useState(sort);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ keyword, brand, sort, page });
                if (minPrice) params.set('minPrice', minPrice);
                if (maxPrice) params.set('maxPrice', maxPrice);
                const { data } = await axios.get(`/api/products?${params}`);
                setProducts(data.products);
                setTotal(data.total);
                setPages(data.pages);
            } catch { } finally { setLoading(false); }
        };
        fetchProducts();
    }, [keyword, brand, sort, minPrice, maxPrice, page]);

    const applyFilters = () => {
        const params = {};
        if (keyword) params.keyword = keyword;
        if (selectedBrand) params.brand = selectedBrand;
        if (selectedSort) params.sort = selectedSort;
        if (localMin && localMin !== '0') params.minPrice = localMin;
        if (localMax && localMax !== '300000') params.maxPrice = localMax;
        setSearchParams(params);
        setPage(1);
        setSidebarOpen(false);
    };

    const clearFilters = () => {
        setSelectedBrand('');
        setSelectedSort('');
        setLocalMin('0');
        setLocalMax('300000');
        setSearchParams({});
        setPage(1);
    };

    const fmt = (v) => `PKR ${Number(v || 0).toLocaleString('en-US')}`;

    const FilterContent = () => (
        <div className="filter-content">
            <div className="filter-section">
                <h3><FiFilter /> Filters</h3>
                {(brand || sort || minPrice || maxPrice) && (
                    <button className="clear-filters-btn" onClick={clearFilters}><FiX /> Clear All</button>
                )}
            </div>

            <div className="filter-group">
                <h4>Sort By</h4>
                {SORTS.map(s => (
                    <label key={s.value} className="filter-option">
                        <input type="radio" name="sort" value={s.value} checked={selectedSort === s.value} onChange={e => setSelectedSort(e.target.value)} />
                        <span>{s.label}</span>
                    </label>
                ))}
            </div>

            <div className="filter-group">
                <h4>Brand</h4>
                {BRANDS.map(b => (
                    <label key={b} className="filter-option">
                        <input type="checkbox" checked={selectedBrand === b} onChange={e => setSelectedBrand(e.target.checked ? b : '')} />
                        <span>{b}</span>
                    </label>
                ))}
            </div>

            <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-inputs">
                    <div className="price-input-wrap">
                        <label>Min</label>
                        <input type="number" className="form-input" value={localMin} onChange={e => setLocalMin(e.target.value)} placeholder="0" />
                    </div>
                    <div className="price-input-wrap">
                        <label>Max</label>
                        <input type="number" className="form-input" value={localMax} onChange={e => setLocalMax(e.target.value)} placeholder="300000" />
                    </div>
                </div>
                <div className="price-display">{fmt(localMin)} — {fmt(localMax)}</div>
            </div>

            <button className="btn btn-primary apply-btn" onClick={applyFilters}>Apply Filters</button>
        </div>
    );

    return (
        <div className="shop-page">
            <div className="shop-hero">
                <div className="container">
                    <h1>
                        {keyword ? `Results for "${keyword}"` : brand ? `${brand} Phones` : 'All Smartphones'}
                    </h1>
                    <p>{total} products found</p>
                </div>
            </div>

            <div className="container shop-layout">
                {/* Desktop Sidebar */}
                <aside className="shop-sidebar">
                    <div className="sidebar-card card">
                        <FilterContent />
                    </div>
                </aside>

                {/* Products Grid */}
                <main className="shop-main">
                    <div className="shop-toolbar">
                        <button className="btn btn-ghost filter-toggle-btn" onClick={() => setSidebarOpen(true)}>
                            <FiFilter /> Filters
                            {(brand || sort) && <span className="filter-active-dot" />}
                        </button>
                        <span className="results-count">{total} results</span>
                    </div>

                    {loading ? (
                        <div className="grid-products">
                            {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: '380px' }} />)}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="no-results">
                            <span>🔍</span>
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search query</p>
                            <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
                        </div>
                    ) : (
                        <motion.div className="grid-products" layout>
                            {products.map(p => <ProductCard key={p._id} product={p} />)}
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {pages > 1 && (
                        <div className="pagination">
                            {[...Array(pages)].map((_, i) => (
                                <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div className="filter-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)} />
                        <motion.div className="filter-drawer glass"
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28 }}>
                            <div className="filter-drawer-header">
                                <h3>Filters</h3>
                                <button onClick={() => setSidebarOpen(false)}><FiX /></button>
                            </div>
                            <FilterContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style>{`
        .shop-page { padding-top: 70px; }
        .shop-hero { padding: 3rem 0 2rem; background: var(--bg-secondary); border-bottom: 1px solid var(--border); }
        .shop-hero h1 { font-family: var(--font-heading); font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; margin-bottom: 0.25rem; }
        .shop-hero p { color: var(--text-muted); font-size: 0.9rem; }
        .shop-layout { display: grid; grid-template-columns: 280px 1fr; gap: 2rem; padding-top: 2rem; padding-bottom: 4rem; }
        .shop-sidebar { position: sticky; top: 90px; height: fit-content; }
        .sidebar-card { padding: 1.5rem; }
        .filter-content { display: flex; flex-direction: column; gap: 1.25rem; }
        .filter-section { display: flex; justify-content: space-between; align-items: center; }
        .filter-section h3 { font-family: var(--font-heading); font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
        .clear-filters-btn { background: none; border: none; color: #f87171; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; }
        .filter-group { display: flex; flex-direction: column; gap: 0.6rem; }
        .filter-group h4 { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border); }
        .filter-option { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; color: var(--text-secondary); font-size: 0.9rem; padding: 0.2rem 0; }
        .filter-option input { accent-color: var(--accent-blue); }
        .filter-option:hover { color: var(--text-primary); }
        .price-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .price-input-wrap label { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.3rem; display: block; }
        .price-display { font-size: 0.8rem; color: var(--accent-blue); font-weight: 500; }
        .apply-btn { width: 100%; justify-content: center; }
        .shop-toolbar { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; justify-content: space-between; }
        .filter-toggle-btn { display: none; position: relative; }
        .filter-active-dot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; border-radius: 50%; background: var(--accent-blue); }
        .results-count { font-size: 0.875rem; color: var(--text-muted); }
        .no-results { text-align: center; padding: 5rem 2rem; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
        .no-results span { font-size: 4rem; }
        .no-results h3 { font-size: 1.3rem; color: var(--text-primary); }
        .pagination { display: flex; justify-content: center; gap: 0.5rem; margin-top: 3rem; flex-wrap: wrap; }
        .page-btn { width: 40px; height: 40px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; transition: var(--transition); }
        .page-btn.active, .page-btn:hover { background: var(--gradient-primary); color: #fff; border-color: transparent; }
        .filter-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1400; }
        .filter-drawer { position: fixed; top: 0; left: 0; bottom: 0; width: min(320px, 90vw); z-index: 1500; padding: 1.5rem; overflow-y: auto; }
        .filter-drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .filter-drawer-header button { background: none; border: none; color: var(--text-primary); font-size: 1.4rem; cursor: pointer; }
        @media (max-width: 900px) {
          .shop-layout { grid-template-columns: 1fr; }
          .shop-sidebar { display: none; }
          .filter-toggle-btn { display: flex; }
        }
      `}</style>
        </div>
    );
};

export default ShopPage;
