import Insta from "scraper-instagram";

export async function getPostData(req, res) {
  const { shortCode } = req.query;

  console.log("shortcode", shortCode);

  if (!shortCode) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Shortcode",
    });
  }

  const InstaClient = new Insta();

  try {
    InstaClient.getPost(shortCode)
      .then((post) => {
        console.log(post);
        return res.status(200).json(post);
      })
      .catch((err) => console.error(err));
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  } catch (error) {
    console.log(error);
  }
}
