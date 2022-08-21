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
    _id: { type: String, required: false, default: "NA" },
    name: { type: String, required: false, default: "NA" },
    categories: { type: Array, required: false }, // Beauty | Fashion | Health | Lifestyle
    languages: { type: Array, required: false }, // English | Hindi | Marathi | Telugu | Urdu
    type: { type: String, required: false, default: "NA" }, // macro | mini | mega
    youtube: { type: yt, default: undefined },
    instagram: { type: ig, default: undefined },
    gender: { type: String, required: false, default: "NA" },
    location: { type: String, required: false, default: "NA" },
    agencyName: { type: String, required: false, default: "NA" },
    manager: { type: String, required: false, default: "NA" },
    contact: { type: Number, required: false },
    email: { type: String, required: false, default: "NA" },
    createdAt: { type: String, required: false }, // ISOString
    updatedAt: { type: String, required: false }, // ISOString
    uploadedBy: {
      id: { type: String, required: false },
      userType: { type: String, required: false }, // team | brand | admin
    }, // agencyId
  },
  {
    collection: "artists",
  }
);

const ArtistModel = mongoose.model("artistModel", ArtistSchema);

export default ArtistModel;
