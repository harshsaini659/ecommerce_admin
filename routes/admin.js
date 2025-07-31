const express = require('express')
const router = express.Router()
const {isLoggedIn} = require('../middleware/auth')
const categoryRoute = require('../routes/categoryRoute')
const variantRoute = require('../routes/variantRoute')
const productRoute = require('../routes/productRoute')
const productVariantRoute = require('../routes/productVariantRoute')

router.get('/dashboard', isLoggedIn, (req,res)=>{
    res.render('admin/dashboard', { 
        title: 'Admin Dashboard',
        pageTitle: 'Admin Dashboard',
        currentPage: 'dashboard'
    })
})

// Apply middleware at the route level
router.use('/category', categoryRoute)
router.use('/variant', variantRoute)
router.use('/product', productRoute)
router.use('/product-variant', productVariantRoute)

module.exports = router