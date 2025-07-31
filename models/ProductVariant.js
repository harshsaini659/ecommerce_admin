const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    // Each variant combination (e.g., "Color: Red, Size: M")
    variantCombination: [{
        variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Variant',
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }],
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    images: [{
        type: String, // URLs to images
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
productVariantSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('ProductVariant', productVariantSchema);
