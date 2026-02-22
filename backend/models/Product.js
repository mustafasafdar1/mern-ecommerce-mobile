const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, default: 'Smartphone' },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    images: [{ type: String }],
    mobileImages: [{ type: String }],
    outOfStock: { type: Boolean, default: false },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    specs: {
        display: String,
        processor: String,
        ram: String,
        storage: String,
        battery: String,
        camera: String,
        os: String,
        color: [String],
    },
    tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
