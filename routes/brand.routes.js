import express from "express";
import {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  insertCampaignIntoBrand,
} from "../controllers/brand.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/all", auth, getBrands);
router.get("/:id", auth, getBrand);
router.post("/create", auth, createBrand);
router.patch("/update", auth, updateBrand);
router.post("/push-campaign", auth, insertCampaignIntoBrand);
router.delete("/:id", auth, deleteBrand);

export default router;
