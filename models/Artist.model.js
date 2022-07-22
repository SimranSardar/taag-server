import mongoose from "mongoose";

const ArtistSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    followers: { type: Number, required: true }, // youtube | instagram
    categories: { type: Array, required: true }, // Beauty | Fashion | Health | Lifestyle
    languages: { type: Array, required: true }, // English | Hindi | Marathi | Telugu | Urdu
    type: { type: String, required: true }, // macro | mini | mega
    gender: { type: String, required: true },
    location: { type: String, required: true },
    agenycName: { type: String, required: true },
    manager: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true }, // ISOString
    updatedAt: { type: String, required: true }, // ISOString
  },
  {
    collection: "artists",
  }
);

const ArtistModel = mongoose.model("artistModel", ArtistSchema);

export default ArtistModel;
