import mongoose from "mongoose";

const kitchenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Kitchen name is required'],
    trim: true,
    maxlength: [100, 'Kitchen name cannot exceed 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Main image URL is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Kitchen description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
}, {
  timestamps: true,
});

const Kitchen = mongoose.model('subKitchen', kitchenSchema);

export default Kitchen;