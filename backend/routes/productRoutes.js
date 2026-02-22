const express = require('express');
const router = express.Router();
const {
    getProducts, getProductById, createProduct, updateProduct,
    deleteProduct, createProductReview, getFeaturedProducts, getBrands
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/brands', getBrands);
router.get('/', getProducts);
router.post('/', protect, admin, createProduct);
router.get('/:id', getProductById);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
