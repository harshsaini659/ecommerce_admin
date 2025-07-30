const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    parent:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null //Top-Level Categories
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Category', categorySchema)