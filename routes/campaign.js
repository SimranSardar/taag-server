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
import auth from "../middlewares/auth.js";

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

router.get("/all", auth, getCampaigns);
router.get("/all-by-user", auth, getUserCampaigns);
router.get("/single/", auth, getCampaign);
router.get("/bulk/query", auth, getCampaignsWithQuery);
router.get("/brand/", auth, getCampaignsByBrand);
router.post("/create", auth, createCampaign);
router.patch("/update/", auth, updateCampaign);
router.post("/upload", upload.single("file"), auth, uploadInvoice);
router.get("/download-invoice", auth, downloadInvoice);

export default router;
