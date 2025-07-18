import mongoose from "mongoose";
import dotenv from "dotenv";
import MainCategory from "../Models/mainCategory.js";

dotenv.config();

const seedMainCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const existing = await MainCategory.find({});
    if (existing.length === 0) {
      await MainCategory.insertMany([
        { name: "Modular Kitchen" ,value:"kitchen"},
        { name: "Modular Furniture" ,value:"furniture"},
      ]);
      console.log("Main categories seeded");
    } else {
      console.log("Main categories already exist");
    }

    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedMainCategories();
