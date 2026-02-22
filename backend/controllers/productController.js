const Product = require('../models/Product');

// @desc  Get all products with filters
// @route GET /api/products
const getProducts = async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: 'i' } }
        : {};
    const brandFilter = req.query.brand ? { brand: req.query.brand } : {};
    const priceFilter =
        req.query.minPrice && req.query.maxPrice
            ? { price: { $gte: Number(req.query.minPrice), $lte: Number(req.query.maxPrice) } }
            : {};
    const ratingFilter = req.query.minRating
        ? { rating: { $gte: Number(req.query.minRating) } }
        : {};

    const query = { ...keyword, ...brandFilter, ...priceFilter, ...ratingFilter };

    let sortOption = {};
    switch (req.query.sort) {
        case 'price_asc': sortOption = { price: 1 }; break;
        case 'price_desc': sortOption = { price: -1 }; break;
        case 'rating': sortOption = { rating: -1 }; break;
        case 'newest': sortOption = { createdAt: -1 }; break;
        default: sortOption = { isFeatured: -1 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOption).limit(pageSize).skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
};

// @desc  Get single product
// @route GET /api/products/:id
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
};

// @desc  Create product (admin)
// @route POST /api/products
const createProduct = async (req, res) => {
    const product = new Product({ ...req.body });
    const created = await product.save();
    res.status(201).json(created);
};

// @desc  Update product (admin)
// @route PUT /api/products/:id
const updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
};

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product removed' });
};

// @desc  Create product review
// @route POST /api/products/:id/reviews
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });

    const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
};

// @desc  Get featured products
// @route GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
};

// @desc  Get all unique brands
// @route GET /api/products/brands
const getBrands = async (req, res) => {
    const brands = await Product.distinct('brand');
    res.json(brands);
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getFeaturedProducts, getBrands };
