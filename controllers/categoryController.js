const Category = require('../models/Category')

function buildCategoryTree(categories, parentId = null) {
  return categories
    .filter(cat => String(cat.parent) === String(parentId))
    .map(cat => ({
      _id: cat._id,
      name: cat.name,
      parent: cat.parent,
      children: buildCategoryTree(categories, cat._id)
    }))
}

async function deleteWithChildren(catId) {
  const children = await Category.find({ parent: catId });

  for (const child of children) {
    await deleteWithChildren(child._id) // recursive
  }

  await Category.findByIdAndDelete(catId)
}

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
    const flatCategories = await Category.find().lean() // All categories
    const categoryTree = buildCategoryTree(flatCategories) // Convert to tree

    res.status(200).json({
      success: true,
      categories: categoryTree
    });

  } catch (err) {
    console.error("Error fetching categories:", err.message)
    res.status(500).send("Server Error")
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const { name, parent } = req.body
    const categoryId = req.params.id

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" })
    }

    if (parent && categoryId === parent) {
      return res.status(400).json({ success: false, message: "A category cannot be its own parent" })
    }

    if (parent) {
      const parentCat = await Category.findById(parent)
      if (!parentCat) {
        return res.status(404).json({ success: false, message: "Parent category not found" })
      }
    }

    // Dynamically build update data
    const updateData = { name };
    if (typeof parent !== 'undefined') {
      updateData.parent = parent || null
    }

    const updated = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updated
    })

  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).send("Error updating category")
  }
}


exports.deleteCategory = async (req, res) => {
  try {
    await deleteWithChildren(req.params.id)

    res.status(200).json({
      success: true,
      message: "Category and all nested subcategories deleted"
    })
  } catch (err) {
    console.error("Recursive Delete Error:", err.message)
    res.status(500).send("Error deleting category tree")
  }
}