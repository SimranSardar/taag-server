import express from "express";
import {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  insertCampaignIntoBrand,
} from "../controllers/brand.js";

const router = express.Router();

router.get("/all", getBrands);
router.get("/:id", getBrand);
router.post("/create", createBrand);
router.patch("/update", updateBrand);
router.post("/push-campaign", insertCampaignIntoBrand);
router.delete("/:id", deleteBrand);

export default router;
