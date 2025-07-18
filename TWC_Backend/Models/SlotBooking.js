import mongoose from "mongoose";

const slotBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  email: String,
  phone: String,
  date: String,
  timeSlot: String,
  status: { type: String, default: 'Pending' },
  suggestedTime: { type: String, default: '' },
}, { timestamps: true });

const SlotBooking = mongoose.model('SlotBooking', slotBookingSchema);
export default SlotBooking;