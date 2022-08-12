import ArtistModel from "../models/Artist.model.js";
import xlsx from "xlsx";
import { v4 as uuid } from "uuid";

export async function createArtist(req, res) {
  try {
    // console.log(req, res);
    const artist = await ArtistModel.create({
      ...req.body,
      _id: `${req.body.name.toUpperCase().replace(/ /g, "_")}_${uuid().replace(
        /-/g,
        "_"
      )}`,
    });
    console.log(artist);
    return res.status(201).json({
      status: "success",
      data: artist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function getArtist(req, res) {
  console.log(req.query);
  if (!req.query.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  try {
    const artist = await ArtistModel.findById(req.query.id);
    return res.status(200).json(artist);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function getArtists(req, res) {
  try {
    const artists = await ArtistModel.find();
    return res.status(200).json(artists);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function updateArtist(req, res) {
  if (!req.query.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  try {
    const artist = await ArtistModel.findByIdAndUpdate(req.query.id, req.body);
    return res.status(200).json({
      status: "success",
      data: artist,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function updateArtists(req, res) {
  let finalArtists = [];
  console.log(req.body);

  for (let i = 0; i < req.body.length; i++) {
    try {
      const artist = await ArtistModel.findByIdAndUpdate(
        req.body[i]._id,
        req.body[i],
        {
          new: true,
          upsert: true,
        }
      );
      finalArtists.push(artist);
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  return res.status(200).json({
    status: "success",
    data: finalArtists,
  });
}

export async function deleteArtist(req, res) {
  if (!req.query.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  try {
    const artist = await ArtistModel.findByIdAndDelete(req.query.id);
    return res.status(200).json({
      status: "success",
      data: artist,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function uploadArtistExcel(req, res) {
  try {
    console.log(req.file, req.user);
    const workBook = xlsx.readFile(req.file.path);

    const workSheet = workBook.Sheets[Object.keys(workBook.Sheets)[0]];

    const data = xlsx.utils.sheet_to_json(workSheet);
    console.log(data);

    let finalData = data.map((item) => ({
      ...item,
      _id: `${uuid().replace(/-/g, "_")}`,
      instagram: item.instagram
        ? {
            ...item.instagram,
            followers: item.instagram?.followers ?? 10000,
          }
        : undefined,
      languages: item.languages?.split(",").map((item) => item.trim()) || [
        "english",
      ],
      gender: item.gender || "NA",
      email: item.email || "NA",
      location: item.location || "Mumbai",
      type: item.type || "type",
      instagram: item.instagram
        ? {
            link: item.instagram,
            followers: item.followers
              ? parseInt(
                  item.followers?.toString().replace(",", "").replace(" ", "")
                ) || 1
              : 0 || 1,
            reelCommercial: item.reelCommercial
              ? parseInt(
                  item.reelCommercial
                    ?.toString()
                    .replace(",", "")
                    .replace(" ", "")
                ) || 1
              : 0 || 1,
            storyCommercial: item.storyCommercial
              ? parseInt(
                  item.storyCommercial
                    ?.toString()
                    .replace(",", "")
                    .replace(" ", "")
                ) || 1
              : 0 || 1,
            averageViews: item.averageInstagramViews
              ? parseInt(
                  item.averageInstagramViews
                    ?.toString()
                    .replace(",", "")
                    .replace(" ", "")
                ) || 1
              : 0 || 1,
          }
        : undefined,
      youtube: item.youtube
        ? {
            link: item.youtube,
            subscribers: item.subscribers
              ? parseInt(
                  item.subscribers?.toString().replace(",", "").replace(" ", "")
                ) || 1
              : 0 ?? 1,
            commercial: item.youtubeCommercial
              ? parseInt(
                  item.youtubeCommercial
                    ?.toString()
                    .replace(",", "")
                    .replace(" ", "")
                ) || 1
              : 0 ?? 1,
            averageViews: item.averageYoutubeViews
              ? parseInt(
                  item.averageYoutubeViews
                    ?.toString()
                    .replace(",", "")
                    .replace(" ", "")
                ) || 1
              : 0 ?? 1,
          }
        : undefined,
      agencyName: item.agencyName || "NA",
      manager: item.manager || item.agencyName || "NA",
      contact: parseInt(item.contact) || 0,
      categories: item.categories
        ? item?.categories?.includes(",")
          ? item.categories.split(",").map((item) => item.trim())
          : item.categories.split("/").map((item) => item.trim())
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      uploadedBy: { id: req.user.id, userType: req.user.userType },
    }));
    const artists = await ArtistModel.insertMany(finalData);
    return res.status(200).json({
      status: "success",
      data: artists,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
