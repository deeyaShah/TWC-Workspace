import mongoose from "mongoose";
const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure subcategory names are unique
  },
  mainCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MainCategory", // Reference to the MainCategory model
    required: true,
  },
}, {
  timestamps: true,
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;