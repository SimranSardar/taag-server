import express from "express";
import {
  getArtist,
  getArtists,
  updateArtist,
  deleteArtist,
} from "../controllers/artist.js";

const router = express.Router();

router.get("/", getArtists);
router.get("/:id", getArtist);
router.patch("/:id", updateArtist);
router.delete("/:id", deleteArtist);

export default router;
