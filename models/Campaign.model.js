import mongoose from "mongoose";

const CampaignSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    isSharedWithBrand: { type: Boolean, required: false },
    brand: {
      name: { type: String, required: true },
      sectors: { type: Array, required: true }, // Beauty | Fashion | Health
      website: { type: String, required: true }, // URL
      poc: {
        id: { type: String, required: true },
        position: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true }, // +91xxxxxxxxxx
        _id: false,
      },
    },
    platform: { type: String, required: true }, // youtube | instagram
    sectors: { type: Array, required: true }, // Beauty | Fashion | Health | Lifestyle
    deliverable: { type: String, required: true }, // video | image
    brief: { type: String, required: true },
    // validity: {
    //   from: { type: String, required: true }, //  ISOString
    //   to: { type: String, required: true }, //  ISOString
    // },
    selectedArtists: { type: Array, required: true },
    brandAmount: { type: Number, required: true },
    currency: { type: String, required: true }, // INR | USD
    agencyFee: { type: Number, required: true },
    averageROI: { type: Number, required: false, default: 0.0 },
    totalCreators: { type: Number, required: true },
    totalAverageViews: { type: Number, required: true },
    status: { type: String, required: true }, // draft | locked | finished
    sharedWith: { type: Array, required: false },
    extras: { type: Array, required: false },
    createdBy: {
      id: { type: String, required: true },
      userType: { type: String, required: true }, // admin | agency | team
    },
    createdAt: { type: String, required: true }, // ISOString
    updatedAt: { type: String, required: true }, // ISOString
  },
  {
    collection: "campaigns",
  }
);

const CampaignModel = mongoose.model("campaignModel", CampaignSchema);

export default CampaignModel;
