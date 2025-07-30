const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const { isLoggedIn } = require('../middleware/auth')

router.post('/createCategory', categoryController.createCategory)
router.get('/listCategory', categoryController.listCategory)
router.patch('/updateCategory/:id', categoryController.updateCategory)
router.delete('/deleteCategory/:id', categoryController.deleteCategory)

// //Create and Read
// //List all categories
// router.get('/', isLoggedIn, categoryController.getAllCategories)
// //Render add category form
// router.get('/add', isLoggedIn, categoryController.renderAddCategoryForm)
// //Handle add category form submission
// router.post('/add', isLoggedIn, categoryController.addCategory)

// //Update
// ///Render edit category form
// router.get('/edit/:id', isLoggedIn, categoryController.renderEditCategoryForm)
// //Handle edit category form submission
// router.post('/edit/:id', isLoggedIn, categoryController.editCategory)

// //Delete
// //Handle delete category
// router.get('/delete/:id', isLoggedIn, categoryController.deleteCategory)

module.exports = router