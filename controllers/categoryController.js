const Category = require('../models/Category')

exports.createCategory = async (req,res)=>{
    try{
        const {name, parent} = req.body
        if(!name) return res.status(400).send("Category name is required")
        const newCategory = await Category.create({
            name,
            parent:parent || null
        })
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: newCategory // when checking in postman this will show the created category
        })
    }catch(err){
        console.error("Create Category Error:", err.message)
        res.status(500).send("Internal Server Error")
    }
}

exports.listCategory = async (req, res) => {
    try {
        const categories = await Category.find().populate('parent').lean()
        // res.render('categories/list', { categories })
        res.status(200).json({
            success: true,
            categories: categories // when checking in postman this will show the list of categories
        })
    } catch (err) {
        console.error("Error fetching categories:", err.message)
        res.status(500).send("Server Error")
    }
}

exports.updateCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;
    await Category.findByIdAndUpdate(req.params.id, {
      name,
      parent: parent || null
    });
    // res.redirect('/admin/categories')
    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category: {name, parent} //when checking in postman this will show the updated category
    })
  } catch (err) {
    res.status(500).send("Error updating category")
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    // res.redirect('/admin/categories')
    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        category: req.params.id // when checking in postman this will show the deleted category id
    })
  } catch (err) {
    res.status(500).send("Error deleting category")
  }
}