import express from "express";
import {
  createCampaign,
  getCampaign,
  getCampaigns,
  getCampaignWithQuery,
  updateCampaign,
  uploadInvoice,
  downloadInvoice,
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
router.get("/single/", getCampaign);
// router.get("/single/query", getCampaignWithQuery);
router.post("/create", createCampaign);
router.patch("/update/", updateCampaign);
router.post("/upload", upload.single("file"), uploadInvoice);
router.get("/download-invoice", downloadInvoice);

export default router;
