import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, // Hash
    userType: { type: String, required: true }, // team | brand | admin
    createdAt: { type: String, required: true }, // ISOString
    updatedAt: { type: String, required: true }, // ISOString
  },
  { collection: "users" }
);

const UserModel = mongoose.model("userModel", UserSchema);

export default UserModel;
