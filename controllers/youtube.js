import axios from "axios";

export async function getStats(req, res) {
  const { videoId } = req.params;
  if (!videoId) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Video ID",
    });
  }
  try {
    console.log("inside");
    const data = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "statistics",
          id: videoId,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );
    let views = data.data.items[0].statistics.viewCount;
    let likes = data.data.items[0].statistics.likeCount;
    let comments = data.data.items[0].statistics.commentCount;
    return res.status(200).json({
      views,
      likes,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function getSubscribers(req, res) {
  const { channelId } = req.params;
  console.log(req.query);
  if (!channelId) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Channel ID",
    });
  }
  try {
    // console.log("inside");
    const data = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "statistics",
          id: channelId,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );
    let subscribers = data.data.items[0].statistics.subscriberCount;
    return res.status(200).json({
      subscribers,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
