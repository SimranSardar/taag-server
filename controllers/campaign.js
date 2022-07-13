import { CampaignModel } from "../models/Campaign.model";
import { v5 as uuid } from "uuid";

export async function createCampaign(req, res) {
  try {
    const res = await CampaignModel.create({
      ...req.body,
      _id: `${req.body.name.toUpperCase()}_${uuid().replace(/-/g, "_")}`,
    });
    return res.status(201).json({
      status: "success",
      data: res,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
