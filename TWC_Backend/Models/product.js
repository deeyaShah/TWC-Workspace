import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    Description: { type: String ,required:true},
    Price:{type:String,required:true},
    Rating: { type: String },
    discountPercentage:{type:String,required:true}
});

const Product = mongoose.model('Product', productSchema);

export default Product; // Default export