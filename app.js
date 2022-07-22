import express from "express";
import cors from "cors";
import instagramRoutes from "./routes/instagram.js";
import campaignRoutes from "./routes/campaign.js";
import youtubeRoutes from "./routes/youtube.js";
import authRoutes from "./routes/auth.js";
import artistRoutes from "./routes/artist.routes.js";
import Insta from "scraper-instagram";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use("/auth", authRoutes);
app.use("/campaigns", campaignRoutes);
app.use("/instagram", instagramRoutes);
app.use("/youtube", youtubeRoutes);
app.use("/artist", artistRoutes);

app.get("/", (req, res) => {
  return res.json({ status: "Taag Server" });
});

const DB_NAME = "TAAG";

const DATABASE_URL = process.env.DB_URI;

mongoose.connect(`${DATABASE_URL}/${DB_NAME}`);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
