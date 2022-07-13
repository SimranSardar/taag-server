import { Model, Schema } from "mongoose";

const CampaignSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    brand: {
      name: { type: String, required: true },
      sector: { type: String, required: true }, // Beauty | Fashion | Health
      website: { type: String, required: true }, // URL
      poc: {
        name: { type: String, required: true },
        position: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true }, // +91xxxxxxxxxx
      },
    },
    platform: { type: String, required: true }, // youtube | instagram
    sector: { type: String, required: true }, // Beauty | Fashion | Health | Lifestyle
    deliverable: { type: String, required: true }, // video | image
    brief: { type: String, required: true },
    validity: {
      from: { type: String, required: true }, //  ISOString
      to: { type: String, required: true }, //  ISOString
    },
    brandAmount: { type: Number, required: true },
    currency: { type: String, required: true }, // INR | USD
    agencyFee: { type: Number, required: true },
    totalCreators: { type: Number, required: true },
    totalAverageViews: { type: Number, required: true },
    status: { type: String, required: true }, // draft | locked | finished
    sharedWith: { type: Array, required: false },
    createdAt: { type: String, required: true }, // ISOString
    updatedAt: { type: String, required: true }, // ISOString
  },
  {
    collection: "campaigns",
  }
);

export const CampaignModel = new Model(CampaignSchema);
