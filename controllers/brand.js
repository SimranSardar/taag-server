import BrandModel from "../models/Brand.model.js";
import { v4 as uuid } from "uuid";

export async function createBrand(req, res) {
  try {
    console.log(req.body);
    const Brand = await BrandModel.create({
      ...req.body,
      _id: `${req.body.name.toUpperCase().replace(/ /g, "_")}_${uuid().replace(
        /-/g,
        "_"
      )}`,
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
    const Brand = await BrandModel.findByIdAndUpdate(req.params.id, req.body);
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
