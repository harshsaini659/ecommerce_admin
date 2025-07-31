const express = require('express')
const router = express.Router()
const variantController = require('../controllers/variantController')

router.post('/createVariant', variantController.createVariant)
router.get('/listVariant', variantController.listVariant)

module.exports = router