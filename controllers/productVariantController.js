const ProductVariant = require('../models/ProductVariant');
const Product = require('../models/Product');
const Variant = require('../models/Variant');

// Create a product variant
exports.createProductVariant = async (req, res) => {
    try {
        const { product, variantCombination, price, stock, sku, images } = req.body;
        
        // Validate required fields
        if (!product || !variantCombination || !price || !sku) {
            return res.status(400).json({
                success: false,
                message: "Product ID, variant combination, price, and SKU are required"
            });
        }
        
        // Check if product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        // Validate variant combinations
        if (!Array.isArray(variantCombination) || variantCombination.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Variant combination must be a non-empty array"
            });
        }
        
        // Check if each variant exists
        for (const item of variantCombination) {
            if (!item.variant || !item.value) {
                return res.status(400).json({
                    success: false,
                    message: "Each variant combination must have a variant ID and value"
                });
            }
            
            const variantExists = await Variant.findById(item.variant);
            if (!variantExists) {
                return res.status(404).json({
                    success: false,
                    message: `Variant with ID ${item.variant} not found`
                });
            }
            
            // Check if value is in variant's values array
            if (!variantExists.values.includes(item.value)) {
                return res.status(400).json({
                    success: false,
                    message: `Value '${item.value}' is not valid for variant '${variantExists.name}'`
                });
            }
        }
        
        // Check if SKU is unique
        const skuExists = await ProductVariant.findOne({ sku });
        if (skuExists) {
            return res.status(400).json({
                success: false,
                message: "SKU must be unique"
            });
        }
        
        // Create product variant
        const productVariant = new ProductVariant({
            product,
            variantCombination,
            price,
            stock: stock || 0,
            sku,
            images: images || []
        });
        
        await productVariant.save();
        
        res.status(201).json({
            success: true,
            message: "Product variant created successfully",
            data: productVariant
        });
        
    } catch (err) {
        console.error("Create Product Variant Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get all variants for a specific product
exports.getProductVariants = async (req, res) => {
    try {
        const { productId } = req.params;
        
        // Check if product exists
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        // Get all variants for the product
        const variants = await ProductVariant.find({ product: productId })
            .populate('product', 'name price')
            .populate('variantCombination.variant', 'name')
            .lean();
        
        if (!variants || variants.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No variants found for this product"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Product variants fetched successfully",
            data: variants
        });
        
    } catch (err) {
        console.error("Get Product Variants Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get a specific product variant
exports.getProductVariant = async (req, res) => {
    try {
        const { id } = req.params;
        
        const variant = await ProductVariant.findById(id)
            .populate('product', 'name price')
            .populate('variantCombination.variant', 'name')
            .lean();
        
        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Product variant not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Product variant fetched successfully",
            data: variant
        });
        
    } catch (err) {
        console.error("Get Product Variant Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Update a product variant
exports.updateProductVariant = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Check if variant exists
        const variant = await ProductVariant.findById(id);
        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Product variant not found"
            });
        }
        
        // If updating SKU, check if it's unique
        if (updates.sku && updates.sku !== variant.sku) {
            const skuExists = await ProductVariant.findOne({ 
                sku: updates.sku,
                _id: { $ne: id }
            });
            
            if (skuExists) {
                return res.status(400).json({
                    success: false,
                    message: "SKU must be unique"
                });
            }
        }
        
        // If updating variant combination, validate
        if (updates.variantCombination) {
            if (!Array.isArray(updates.variantCombination) || updates.variantCombination.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Variant combination must be a non-empty array"
                });
            }
            
            // Check if each variant exists and values are valid
            for (const item of updates.variantCombination) {
                if (!item.variant || !item.value) {
                    return res.status(400).json({
                        success: false,
                        message: "Each variant combination must have a variant ID and value"
                    });
                }
                
                const variantExists = await Variant.findById(item.variant);
                if (!variantExists) {
                    return res.status(404).json({
                        success: false,
                        message: `Variant with ID ${item.variant} not found`
                    });
                }
                
                if (!variantExists.values.includes(item.value)) {
                    return res.status(400).json({
                        success: false,
                        message: `Value '${item.value}' is not valid for variant '${variantExists.name}'`
                    });
                }
            }
        }
        
        // Update variant
        const updatedVariant = await ProductVariant.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: Date.now() },
            { new: true }
        )
        .populate('product', 'name price')
        .populate('variantCombination.variant', 'name');
        
        res.status(200).json({
            success: true,
            message: "Product variant updated successfully",
            data: updatedVariant
        });
        
    } catch (err) {
        console.error("Update Product Variant Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Delete a product variant
exports.deleteProductVariant = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if variant exists
        const variant = await ProductVariant.findById(id);
        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Product variant not found"
            });
        }
        
        // Delete variant
        await ProductVariant.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: "Product variant deleted successfully"
        });
        
    } catch (err) {
        console.error("Delete Product Variant Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
