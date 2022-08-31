import BrandModel from "../models/Brand.model.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function createBrand(req, res) {
  const { name, email, password } = req.body;

  try {
    const newUser = await BrandModel.findOne({ name, email });

    if (newUser) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    console.log(req.body);

    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(req.body);
    const Brand = await BrandModel.create({
      ...req.body,
      _id: `${req.body.name.toUpperCase().replace(/ /g, "_")}_${uuid().replace(
        /-/g,
        "_"
      )}`,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(Brand);
    return res.status(201).json({
      status: "success",
      data: Brand,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function getBrand(req, res) {
  console.log(req.query);
  if (!req.query.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  try {
    const Brand = await BrandModel.findById(req.query.id);
    return res.status(200).json(Brand);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function getBrands(req, res) {
  try {
    const Brands = await BrandModel.find().limit(10);
    return res.status(200).json(Brands);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function updateBrand(req, res) {
  if (!req.params.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  try {
    const Brand = await BrandModel.findByIdAndUpdate(req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString(),
    });
    return res.status(200).json({
      status: "success",
      data: Brand,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function insertCampaignIntoBrand(req, res) {
  if (!req.body.email) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Email",
    });
  }

  if (!req.body.campaignId) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Campaign Id",
    });
  }

  try {
    const Brand = await BrandModel.findOneAndUpdate(
      { "poc.email": req.body.email },
      {
        $set: { $push: { campaigns: req.body.campaignId } },
        updatedAt: new Date().toISOString(),
      }
    );
    return res.status(200).json({
      status: "success",
      data: Brand,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function deleteBrand(req, res) {
  if (!req.query.id) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID",
    });
  }

  try {
    const Brand = await BrandModel.findByIdAndDelete(req.query.id);
    return res.status(200).json({
      status: "success",
      data: Brand,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
