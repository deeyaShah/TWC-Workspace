import MainCategory from "../Models/mainCategory.js";

const getMainCategories = async (req, res) => {
  try {
    const mainCategories = await MainCategory.find();
    res.status(200).json(mainCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default getMainCategories;