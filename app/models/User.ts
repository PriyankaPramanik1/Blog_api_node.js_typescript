import mongoose, { Schema } from "mongoose";
import { userInertface } from "../interface/user.interface";

const UserSchema = new Schema<userInertface>(
  {
    name: 
    { type: String,
     required: true 
    },
    email: 
    { type: String,
      required: true,
      unique: true, 
      lowercase: true 
    },
    password: 
    { type: String,
      required: true 
    },
    role: 
    { type: String, 
      enum: ["user", "author"],
      default: "user" 
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<userInertface>("User", UserSchema);
