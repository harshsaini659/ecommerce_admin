const mongoose = require('mongoose')

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  values: [{
    type: String,
    required: true,
    trim: true
  }]
}, { timestamps: true })

module.exports = mongoose.model('Variant', variantSchema)
