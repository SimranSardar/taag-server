import express from "express";
import {
  createCampaign,
  getCampaign,
  getCampaigns,
} from "../controllers/campaign.js";

const router = express.Router();

router.get("/all", getCampaigns);
router.get("/single/", getCampaign);
router.post("/create", createCampaign);

export default router;
