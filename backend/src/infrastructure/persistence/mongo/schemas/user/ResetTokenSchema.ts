import mongoose from "mongoose";

const ResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    unique: true
  },
  tokenHash: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
     
  }
}, { timestamps: true });

export const ResetTokenModel = mongoose.model(
  "ResetToken",
  ResetTokenSchema
);
