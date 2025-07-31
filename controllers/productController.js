
const Product = require('../models/Product');
const Category = require('../models/Category');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, images, category, stock, featured } = req.body;
        
        // Validate required fields
        if (!name || !description || !price || !images || !category) {
            return res.status(400).json({
                success: false,
                message: "Name, description, price, images, and category are required"
            });
        }
        
        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Category not found"
            });
        }
        
        // Create product
        const product = new Product({
            name,
            description,
            price,
            images,
            category,
            stock: stock || 0,
            featured: featured || false
        });
        
        await product.save();
        
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
        
    } catch (err) {
        console.error("Create Product Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get all products
exports.listProducts = async (req, res) => {
    try {
        const products = await Product.find()
                                     .populate('category', 'name')
                                     .lean();
        
        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });
        
    } catch (err) {
        console.error("List Products Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get a product by ID
exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findById(id)
                                    .populate('category', 'name')
                                    .lean();
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
        
    } catch (err) {
        console.error("Get Product Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        // Check if category exists if being updated
        if (updates.category) {
            const categoryExists = await Category.findById(updates.category);
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: "Category not found"
                });
            }
        }
        
        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: Date.now() },
            { new: true }
        ).populate('category', 'name');
        
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
        
    } catch (err) {
        console.error("Update Product Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        // Delete product
        await Product.findByIdAndDelete(id);
        
        // Note: You might want to also delete related product variants
        
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
        
    } catch (err) {
        console.error("Delete Product Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
