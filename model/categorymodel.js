const mongoose = require("mongoose");
const { Schema } = mongoose;

const storeCategorySchema = new Schema(
  {
    name: { type: String, required: true }, 
    description: { type: String, required: false }, 
    status: {
      type: Number,
      enum: [1, 2, 3], // 1-Active, 2-Inactive, 3-Blocked
      default: 1,
    },
  },
  { timestamps: true }
);

const StoreCategory = mongoose.model("StoreCategory", storeCategorySchema);
module.exports = StoreCategory;
