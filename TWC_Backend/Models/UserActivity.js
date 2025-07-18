import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true,
  },
  ipAddress: String,
  userAgent: String,
}, { timestamps: true });

const UserActivity =
  mongoose.models.UserActivity || mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;