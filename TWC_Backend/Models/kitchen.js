import mongoose from 'mongoose';

const { Schema } = mongoose;

const kitchenSchema = new Schema({
    title: { type: String, required: true },
    images: [
        {
          type: String,
        },
      ],    
    Description: { type: String ,required:true},
    Details:{type : String , required:true}
});

const kitchen = mongoose.model('kitchen', kitchenSchema);

export default kitchen; // Default export