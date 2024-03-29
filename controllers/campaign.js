import CampaignModel from "../models/Campaign.model.js";
import ArtistModel from "../models/Artist.model.js";
import { v4 as uuid } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createCampaign(req, res) {
  const user = req.user;
  if (!user) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }
  try {
    // console.log(req, res);
    const campaign = await CampaignModel.create({
      ...req.body,
      _id: `${req.body.name.toUpperCase().replace(/ /g, "_")}_${uuid().replace(
        /-/g,
        "_"
      )}`,
      createdBy: {
        id: user.id,
        userType: user.userType, // admin | agency | team
      },
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
  // console.log(req.query);
  if (!req.query.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  try {
    const campaign = await CampaignModel.findById(req.query.id);

    if (req.user?.userType !== "admin" || req.user?.userType !== "team") {
      if (campaign.createdBy.id !== req.user.id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }
    }

    if (campaign?.selectedArtists.length) {
      const artists = await ArtistModel.find(
        { _id: { $in: campaign.selectedArtists.map((item) => item._id) } },
        { createdAt: 0, updatedAt: 0 }
      );
      let artistsObj = artists.map((artist) => artist.toObject());
      campaign.selectedArtists = campaign.selectedArtists.map((artist) => ({
        ...artistsObj.find((item) => item._id === artist._id),
        ...artist,
        totalAverageViews: artist.totalAverageViews || 0,
        invoice: artist.invoice,
      }));
    }
    console.log("Uassssss", campaign.selectedArtists[0]);
    return res.status(200).json(campaign);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

async function getArtist(campaign) {
  return await ArtistModel.find(
    { _id: { $in: campaign.selectedArtists.map((item) => item._id) } },
    { createdAt: 0, updatedAt: 0 }
  );
}

export async function getCampaignsWithQuery(req, res) {
  console.log(req.query);
  if (!req.query.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  let query = { ...req.query.query };

  try {
    const campaigns = await CampaignModel.find({ ...query });
    let artistGetPromises = campaigns.map((campaign) =>
      campaign.selectedArtists ? getArtist(campaign) : null
    );
    let artistsResults = await Promise.all(artistGetPromises);
    let newCampaigns = campaigns.map((campaign) => campaign.toObject());
    artistsResults.forEach((artists, i) => {
      if (artists) {
        newCampaigns[i].selectedArtists = newCampaigns[i].selectedArtists.map(
          (artist) => ({
            ...artist,
            ...artists
              .map((artist) => artist.toObject())
              .find((item) => item._id === artist._id),
          })
        );
      }
    });
    // campaigns.forEach((campaign) => {
    //   if (campaign.selectedArtists.length) {
    //     const artists = await ArtistModel.find(
    //       { _id: { $in: campaign.selectedArtists.map((item) => item._id) } },
    //       { createdAt: 0, updatedAt: 0 }
    //     );
    //     let artistsObj = artists.map((artist) => artist.toObject());
    //     campaign.selectedArtists = campaign.selectedArtists.map((artist) => ({
    //       ...artist,
    //       ...artistsObj.find((item) => item._id === artist._id),
    //     }));
    //     console.log(campaign.selectedArtists);
    //   }
    // })
    return res.status(200).json(campaigns);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function getCampaignsByBrand(req, res) {
  console.log(req.query);
  if (!req.query.brand) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Brand",
    });
  }

  let { brand } = req.query;

  try {
    const campaigns = await CampaignModel.find({
      "brand.email": { $regex: brand, $options: "i" },
      isSharedWithBrand: true,
    });
    let artistGetPromises = campaigns.map((campaign) =>
      campaign.selectedArtists ? getArtist(campaign) : null
    );
    let artistsResults = await Promise.all(artistGetPromises);
    let newCampaigns = campaigns.map((campaign) => campaign.toObject());
    artistsResults.forEach((artists, i) => {
      if (artists) {
        newCampaigns[i].selectedArtists = newCampaigns[i].selectedArtists.map(
          (artist) => ({
            ...artist,
            ...artists
              .map((artist) => artist.toObject())
              .find((item) => item._id === artist._id),
          })
        );
      }
    });
    // campaigns.forEach((campaign) => {
    //   if (campaign.selectedArtists.length) {
    //     const artists = await ArtistModel.find(
    //       { _id: { $in: campaign.selectedArtists.map((item) => item._id) } },
    //       { createdAt: 0, updatedAt: 0 }
    //     );
    //     let artistsObj = artists.map((artist) => artist.toObject());
    //     campaign.selectedArtists = campaign.selectedArtists.map((artist) => ({
    //       ...artist,
    //       ...artistsObj.find((item) => item._id === artist._id),
    //     }));
    //     console.log(campaign.selectedArtists);
    //   }
    // })
    return res.status(200).json(campaigns);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function getCampaigns(req, res) {
  try {
    const status = req.query.status;
    let query = { ...req.query };
    console.log({ query });
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

export async function getUserCampaigns(req, res) {
  try {
    const status = req.query.status;
    let query = { ...req.query };
    console.log({ query });
    if (status !== "all") {
      const campaigns = await CampaignModel.find({
        status,
        "createdBy.id": req.query.userId,
      }).limit(10);
      return res.status(200).json(campaigns).limit(10);
    }
    const campaigns = await CampaignModel.find({
      "createdBy.id": req.query.userId,
    }).limit(10);
    return res.status(200).json(campaigns);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function updateCampaign(req, res) {
  if (!req.body._id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Campaign",
    });
  }

  try {
    console.log(req.body);
    const campaignUpdate = await CampaignModel.findByIdAndUpdate(
      req.body._id,
      { ...req.body, updatedAt: new Date().toISOString() },
      { new: true }
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

export async function uploadInvoice(req, res) {
  // console.log(req.file);
  // console.log(req.body);
  if (!req.body?.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  try {
    const campaign = await CampaignModel.findById(req.body.id);
    const idx = campaign.selectedArtists.findIndex(
      (item) => item._id === req.body.artistId
    );
    campaign.selectedArtists[idx] = {
      ...campaign.selectedArtists[idx],
      invoice: req.file.filename,
    };
    console.log(campaign);
    await campaign.save();
    return res.status(200).json({
      status: "success",
      data: campaign,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function downloadInvoice(req, res) {
  if (!req.query.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  const campaign = await CampaignModel.findById(req.query.id);
  console.log(campaign, req.query.id, req.query.artistId);
  const artist = campaign.selectedArtists.find(
    (item) => item._id === req.query.artistId
  );
  console.log(artist);
  const file = `${__dirname}/../uploads/${artist.invoice}`;
  return res.download(file);
}
