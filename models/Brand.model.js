import mongoose from "mongoose";

const BrandSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    sector: { type: String, required: true }, // Beauty | Fashion | Health
    website: { type: String, required: true }, // URL
    poc: {
      name: { type: String, required: true },
      position: { type: String, required: true },
      contact: { type: String, required: true }, // +91xxxxxxxxxx
      email: { type: String, required: true },
    },
    campaigns: { type: Array, required: false },
    createdAt: { type: String, required: true }, // ISOString
    updatedAt: { type: String, required: true }, // ISOString
  },
  { collection: "brands" }
);

const BrandModel = mongoose.model("brandModel", BrandSchema);

export default BrandModel;
