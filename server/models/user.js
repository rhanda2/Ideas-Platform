import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  walletAddress: { type: String, required: true },
  userName: { type: String, required:  true },
  email: { type: String, required: true },
  bio: { type: String, required: false },
  interests: { type: String, required: false },
});

export default mongoose.model("User", userSchema);