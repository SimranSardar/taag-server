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
    const artists = await ArtistModel.find().limit(10);
    return res.status(200).json(artists);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function updateArtist(req, res) {
  if (!req.params.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  try {
    const artist = await ArtistModel.findByIdAndUpdate(req.params.id, req.body);
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
    console.log(req.file);
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
            followers: item.instagram.followers ?? 10000,
          }
        : undefined,
      languages: item.languages?.split(",").map((item) => item.trim()) || [
        "english",
      ],
      location: item.location || "Mumbai",
      type: item.type || "type",
      instagram: item.instagram
        ? {
            link: item.instagram,
            followers: item.followers
              ? parseInt(
                  item.followers.toString().replace(",", "").replace(" ", "")
                ) || 1
              : 0 || 1,
            reelCommercial: item.reelCommercial
              ? parseInt(
                  item.reelCommercial
                    .toString()
                    .replace(",", "")
                    .replace(" ", "")
                ) || 1
              : 0 || 1,
            storyCommercial: item.storyCommercial
              ? parseInt(
                  item.storyCommercial
                    .toString()
                    .replace(",", "")
                    .replace(" ", "")
                ) || 1
              : 0 || 1,
            averageViews: item.averageInstagramViews
              ? parseInt(
                  item.averageInstagramViews
                    .toString()
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
                  item.subscribers.toString().replace(",", "").replace(" ", "")
                ) || 1
              : 0 ?? 1,
            commercial: item.yotubeCommercial
              ? parseInt(
                  item.yotubeCommercial
                    .toString()
                    .replace(",", "")
                    .replace(" ", "")
                ) || 1
              : 0 ?? 1,
            averageViews: item.averageYouTubeViews
              ? parseInt(
                  item.averageYouTubeViews
                    .toString()
                    .replace(",", "")
                    .replace(" ", "")
                ) || 1
              : 0 ?? 1,
          }
        : undefined,
      agencyName: item.agencyName || "NA",
      manager: item.manager || "NA",
      contact: parseInt(item.contact) || 0,
      categories: item.categories.split(",").map((item) => item.trim()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
