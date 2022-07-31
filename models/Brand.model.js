import mongoose from "mongoose";

const BrandSchema = mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  campaigns: { type: Array, required: true },
  createdAt: { type: String, required: true }, // ISOString
  updatedAt: { type: String, required: true }, // ISOString
});

const BrandModel = mongoose.model("BrandModel", BrandSchema);

export default BrandModel;
