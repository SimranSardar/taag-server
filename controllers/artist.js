import ArtistModel from "../models/Artist.model.js";
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
    const status = req.query.status;
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
