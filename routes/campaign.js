import express from "express";
import {
  createCampaign,
  getCampaign,
  getCampaigns,
  updateCampaign,
} from "../controllers/campaign.js";

const router = express.Router();

router.get("/all", getCampaigns);
router.get("/single/", getCampaign);
router.post("/create", createCampaign);
router.patch("/update/:id", updateCampaign);

export default router;
