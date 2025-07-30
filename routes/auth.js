const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

//render signup page
router.get('/signup', authController.renderSignup)
//handle signup form submission
router.post('/signup', authController.signup)

//render login page
router.get('/login', authController.renderLogin)
//handle login form submission
router.post('/login', authController.login)

//logout route
router.get('/logout', authController.logout)

module.exports = router