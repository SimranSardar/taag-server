import mongoose from "mongoose";

const yt = {
  subscribers: { type: Number, required: true },
  link: { type: String, required: true },
  commercial: { type: Number, required: true },
  averageViews: { type: Number, required: true },
};

const ig = {
  followers: { type: Number, required: true },
  link: { type: String, required: true },
  reelCommercial: { type: Number, required: true },
  storyCommercial: { type: Number, required: true },
  averageViews: { type: Number, required: true },
};
const ArtistSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    categories: { type: Array, required: true }, // Beauty | Fashion | Health | Lifestyle
    languages: { type: Array, required: true }, // English | Hindi | Marathi | Telugu | Urdu
    type: { type: String, required: true }, // macro | mini | mega
    youtube: { type: yt, default: undefined },
    instagram: { type: ig, default: undefined },
    gender: { type: String, required: true },
    location: { type: String, required: true },
    agencyName: { type: String, required: true },
    manager: { type: String, required: true },
    contact: { type: Number, required: true },
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
