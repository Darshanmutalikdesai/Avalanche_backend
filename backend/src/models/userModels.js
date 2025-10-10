import mongoose from "mongoose";
import Counter from "./counterModel.js";

const userSchema = new mongoose.Schema({
  _id: {
    type: String, // Custom ID (ava0001, ava0002…)
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  pNumber : {
    type: String,
    required : true,
  },
  password: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true,
  },
  institute: {
    type: String,
    required: true,
    trim: true,
  },
  otp: String,
  otpExpiresAt: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// ✅ Auto-generate custom ID before saving
userSchema.pre("save", async function (next) {
  if (this.isNew && !this._id) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqNum = counter.seq.toString().padStart(4, "0"); // → 0001
    this._id = `ava${seqNum}`;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
