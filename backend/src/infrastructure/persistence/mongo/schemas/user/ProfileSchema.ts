import mongoose, { Schema, Document } from "mongoose";

export interface ProfileDocument extends Document {
  createdAt: Date | undefined;
  userId: string;
  dob?: Date;
  address?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  profilePictureUrl?: string;
  updatedAt?: Date;
}

const AddressSchema = new Schema(
  {
    line1: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  { _id: false }
);

const ProfileSchema = new Schema<ProfileDocument>(
  {
    userId: {
      type: String,  // Change it to object of User foreign key
      required: true,
      unique: true, 
      index: true,
    },
    dob: {
      type: Date,
    },
    address: {
      type: AddressSchema,
    },
    profilePictureUrl: {
      type: String,
    },
    updatedAt: {
      type: Date,
    },
  }
);

export const ProfileModel = mongoose.model<ProfileDocument>(
  "Profile",
  ProfileSchema
);
