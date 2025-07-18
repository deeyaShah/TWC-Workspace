import SubCategory from "../Models/SubCategory.js";

const createSubCategory = async (req, res) => {
  try {
    const { name, mainCategory } = req.body;

    const newSubCategory = new SubCategory({ name, mainCategory });
    await newSubCategory.save();

    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get subcategories of specific mainCategory
const getSubCategories = async (req, res) => {
  const { mainCategoryId } = req.params;
  try {
    const subCategories = await SubCategory.find({ mainCategory: mainCategoryId });
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const updated = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    ).populate("mainCategory");

    if (!updated) {
      return res.status(404).json({ message: "Subcategory not found." });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a specific subcategory by ID
const deleteSubCategories = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.status(200).json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default{
    createSubCategory,
    getSubCategories,
    updateSubCategory,
    deleteSubCategories,
};