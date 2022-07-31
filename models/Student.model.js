import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: Number, required: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
  },
  { collection: "users" }
);

export const UserModel = mongoose.model("UserModel", UserSchema);
