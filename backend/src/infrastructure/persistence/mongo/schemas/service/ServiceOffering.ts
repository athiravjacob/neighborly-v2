import { Schema, model } from "mongoose";

const ServiceOfferingSchema = new Schema(
    {
      serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true
      },
  
      categoryId: {
        type: Schema.Types.ObjectId,
        required: true
      },
  
      variantId: {
        type: Schema.Types.ObjectId,
        required: true
      },
  
      price: {
        type: Number,
        required: true,
        min: 1
      },
  
      durationInMinutes: {
        type: Number,
        required: true,
        min: 1
      },
  
      isActive: {
        type: Boolean,
        default: true
      }
    },
    { timestamps: true }
  );
  

const offeringModel = model("ServiceOffering",ServiceOfferingSchema)