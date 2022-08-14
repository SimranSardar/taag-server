import mongoose from "mongoose";

const PasswordReset = mongoose.Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true },
    resetURI: { type: String, required: true },
    userType: { type: String, required: true }, // team | brand | admin
    createdAt: { type: String, required: true }, // ISOString
    expiresAt: { type: String, required: true }, // ISOString
  },
  { collection: "resetPassword" }
);

const PasswordResetModel = mongoose.model("PasswordResetModel", PasswordReset);

export default PasswordResetModel;
