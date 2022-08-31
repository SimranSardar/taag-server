import express from "express";
import {
  createCampaign,
  getCampaign,
  getCampaigns,
  getCampaignsWithQuery,
  updateCampaign,
  uploadInvoice,
  downloadInvoice,
  getCampaignsByBrand,
  getUserCampaigns,
} from "../controllers/campaign.js";
import multer from "multer";

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(console.log(file.originalname), file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

const router = express.Router();

router.get("/all", getCampaigns);
router.get("/all-by-user", getUserCampaigns);
router.get("/single/", getCampaign);
router.get("/bulk/query", getCampaignsWithQuery);
router.get("/brand/", getCampaignsByBrand);
router.post("/create", createCampaign);
router.patch("/update/", updateCampaign);
router.post("/upload", upload.single("file"), uploadInvoice);
router.get("/download-invoice", downloadInvoice);

export default router;
