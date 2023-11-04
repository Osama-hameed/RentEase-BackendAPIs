import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    propertyLocation: {
      type: String,
      required: true,
      trim: true,
    },
    propertySize: {
      type: Number,
      required: true,
    },
    propertyRent: {
        type: Number,
        required: true,
    },
    propertyDescription: {
        type: String,
        required: true,
    },
    user:{
        type:mongoose.ObjectId,
        ref:"users",
        required:true,
    },
      },
  { timestamps: true }
);

export default mongoose.model("property", propertySchema);