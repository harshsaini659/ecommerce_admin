const express = require('express');
const router = express.Router();
const productVariantController = require('../controllers/productVariantController');
const { isLoggedIn } = require('../middleware/auth');

// Product Variant routes
router.post('/create', isLoggedIn, productVariantController.createProductVariant);
router.get('/product/:productId', isLoggedIn, productVariantController.getProductVariants);
router.get('/:id', isLoggedIn, productVariantController.getProductVariant);
router.put('/update/:id', isLoggedIn, productVariantController.updateProductVariant);
router.delete('/delete/:id', isLoggedIn, productVariantController.deleteProductVariant);

module.exports = router;
