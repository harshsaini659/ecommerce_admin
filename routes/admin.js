const express = require('express')
const router = express.Router()
const {isLoggedIn} = require('../middleware/auth')
const categoryRoute = require('../routes/categoryRoute')

router.get('/dashboard', isLoggedIn, (req,res)=>{
    res.render('admin/dashboard', { 
        title: 'Admin Dashboard',
        pageTitle: 'Admin Dashboard',
        currentPage: 'dashboard'
    })
})

router.use('/category', isLoggedIn, categoryRoute)

module.exports = router