const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  name: { type: String, required: true },
  location: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  address: {
    line1: { type: String },
    line2: { type: String },
    state: { type: String },
    pincode: { type: Number },
    country: { type: String },
    city: { type: String },
  },
  contactNo: { type: Number },
  dialCode: { type: Number },
  openingTime: { type: Date },
  closingTime: { type: Date },
  upi: { type: String },
  payAtStoreCommission: { type: Number },
  ecommerceCommission: { type: Number, required: true },
  status: {
    type: Number, // 1 - Onboarded, 2 - Active, 3 - Inactive, 4 - Blocked
    required: true,
  },
  images: [{
    type: String, // URLs of the store images
  }],
  schedule: [{
    day: { type: String, required: true },
    openingTime: { type: Date, required: true },
    closingTime: { type: Date, required: true },
  }],
}, { timestamps: true });


const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
