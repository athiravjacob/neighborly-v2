import { Schema, model } from "mongoose";
import { ServiceType } from "../../../../../domain/enums/ServiceType";

const VariantSchema = new Schema(
    {
      varieantName: {
        type: String,
        required: true
      },
      isActive: {
        type: Boolean,
        default: true
      }
    },
    { _id: true }
  );
  



const CategorySchema = new Schema({
    
    categoryName:{
        type:String,
        required:true,
    },
    serviceType: {
        type: String,
        enum: Object.values(ServiceType),
        required: true
      }
      ,
    inclusion:{
        type:[String]
    },
    exclusion:{
        type:[String]
    },
    variants: { type: [VariantSchema], default: [] },

    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps: true
  })


const ServiceSchema = new Schema({
  serviceName:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    categories: { type: [CategorySchema], default: [] },
    isActive: {
        type: Boolean,
        default: true
      }
},{timestamps:true})

export const ServiceModel = model("Service",ServiceSchema)