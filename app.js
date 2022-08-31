import express from "express";
import cors from "cors";
import instagramRoutes from "./routes/instagram.js";
import campaignRoutes from "./routes/campaign.js";
import youtubeRoutes from "./routes/youtube.js";
import authRoutes from "./routes/auth.js";
import artistRoutes from "./routes/artist.routes.js";
import userRoutes from "./routes/user.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import Insta from "scraper-instagram";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ServerApiVersion } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use("/auth", authRoutes);
app.use("/campaigns", campaignRoutes);
app.use("/instagram", instagramRoutes);
app.use("/youtube", youtubeRoutes);
app.use("/artist", artistRoutes);
app.use("/user", userRoutes);
app.use("/brand", brandRoutes);

app.get("/", (req, res) => {
  return res.json({ status: "Taag Server" });
});

const DB_NAME = "TAAG";

const DATABASE_URL = process.env.DB_URI;

mongoose.connect(`${DATABASE_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
