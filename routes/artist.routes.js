import express from "express";
import {
  createArtist,
  getArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadArtistExcel,
} from "../controllers/artist.js";
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

router.get("/all", getArtists);
router.get("/:id", getArtist);
router.post("/create", createArtist);
router.post("/bulk", upload.single("file"), uploadArtistExcel);
router.patch("/:id", updateArtist);
router.delete("/:id", deleteArtist);

export default router;