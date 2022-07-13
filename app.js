import express from "express";
import cors from "cors";
import instagramRoutes from "./routes/instagram.js";
import Insta from "scraper-instagram";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// app.use("/instagram", instagramRoutes);

app.get("/", (req, res) => {
  return res.json({ status: "working" });
});

app.get("/instagram", (req, res) => {
  const shortcode = "CfguyK5DH3l";

  const InstaClient = new Insta();
  InstaClient.getPost(shortcode)
    .then((post) => {
      return res.status(200).json(post);
    })
    .catch((err) => console.error(err));

  //   res.status(200).json({
  //     status: "Success",
  //   });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
