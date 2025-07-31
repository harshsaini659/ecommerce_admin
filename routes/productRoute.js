const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isLoggedIn } = require('../middleware/auth');

// Product routes
router.post('/create', isLoggedIn, productController.createProduct);
router.get('/list', isLoggedIn, productController.listProducts);
router.get('/:id', isLoggedIn, productController.getProduct);
router.put('/update/:id', isLoggedIn, productController.updateProduct);
router.delete('/delete/:id', isLoggedIn, productController.deleteProduct);

module.exports = router;
