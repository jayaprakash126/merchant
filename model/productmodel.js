const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  discountType: {
    type: Number, // 1 - Percentage, 2 - Fixed amount
    required: false,
  },
  discountValue: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  unit: {
    type: Number, // 1 - One unit, 2 - One pack, 3 - Gram, 4 - Kilogram, 5 - Millilitre, 6 - Litre
    required: true,
  },
  unitType: {
    type: Number, // Same values as unit type
    required: true,
  },
  status: {
    type: Number, // 1 - Active, 2 - Inactive
    required: true,
  },
  images: [{
    type: String, // URLs of product images
  }],
  inventory: [
    {
      type: {
        type: Number,
        enum: [1, 2], // 1: Credit, 2: Debit
        required: true,
      },
      referenceType: {
        type: Number,
        enum: [1, 2], // 1: Stock in, 2: Stock out
      },
      quantity: {
        type: Number,
        required: true,
      },
      closingBalance: {
        type: Number,
        required: true,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;