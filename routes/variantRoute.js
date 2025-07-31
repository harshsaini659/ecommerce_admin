const express = require('express')
const router = express.Router()
const variantController = require('../controllers/variantController')
const { isLoggedIn } = require('../middleware/auth')

router.post('/createVariant', isLoggedIn, variantController.createVariant)
router.get('/listVariant', isLoggedIn, variantController.listVariant)
router.put('/updateVariant/:id', isLoggedIn, variantController.updateVariant)
router.delete('/deleteVariant/:id', isLoggedIn, variantController.deleteVariant)

module.exports = router