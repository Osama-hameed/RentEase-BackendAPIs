import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userid: {
      type: Number,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
        type:Number,
        required:false,
        default:0
    },
      },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);