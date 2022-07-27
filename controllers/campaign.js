import CampaignModel from "../models/Campaign.model.js";
import ArtistModel from "../models/Artist.model.js";
import { v4 as uuid } from "uuid";

export async function createCampaign(req, res) {
  try {
    // console.log(req, res);
    const campaign = await CampaignModel.create({
      ...req.body,
      _id: `${req.body.name.toUpperCase().replace(/ /g, "_")}_${uuid().replace(
        /-/g,
        "_"
      )}`,
    });
    console.log(campaign);
    return res.status(201).json({
      status: "success",
      data: campaign,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function getCampaign(req, res) {
  console.log(req.query);
  if (!req.query.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  try {
    const campaign = await CampaignModel.findById(req.query.id);
    if (campaign.selectedArtists.length) {
      const artists = await ArtistModel.find({
        _id: {
          $in: campaign.selectedArtists.map((item) => {
            return item._id;
          }),
        },
      });
      const temp = artists.map((item) => {
        return item.toObject();
      });
      campaign.selectedArtists = campaign.selectedArtists.map((item) => {
        return {
          ...item,
          ...temp.find((t) => {
            return t._id === item._id;
          }),
        };
      });
      return res.json(campaign);
    }
    return res.status(200).json(campaign);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function getCampaigns(req, res) {
  try {
    const status = req.query.status;
    if (status !== "all") {
      const campaigns = await CampaignModel.find({ status }).limit(10);
      return res.status(200).json(campaigns).limit(10);
    }
    const campaigns = await CampaignModel.find().limit(10);
    return res.status(200).json(campaigns);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function updateCampaign(req, res) {
  if (!req.params.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  try {
    console.log(req.body);
    const campaignUpdate = await CampaignModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    return res.status(200).json({
      status: "success",
      data: campaignUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function deleteCampaign(req, res) {
  if (!req.query.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  try {
    const res = await CampaignModel.findByIdAndDelete(req.query.id);
    return res.status(200).json({
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
