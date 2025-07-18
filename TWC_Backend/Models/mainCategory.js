import mongoose from "mongoose";

const mainCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Modular Kitchen", "Modular Furniture"], // Fixed values
  },
  value: {
    type: String,
    required: true,
    enum: ["kitchen", "furniture"],
    unique: true,
  },
}, {
  timestamps: true,
});

const MainCategory=mongoose.model("MainCategory", mainCategorySchema);

export default MainCategory;