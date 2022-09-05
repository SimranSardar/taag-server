import axios from "axios";
import { extractChannelIDFromYoutubeURL } from "../utils.js";

export async function getStats(req, res) {
  const { videoId } = req.query;
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
      videoId,
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
  const { youtubeURI } = req.query;

  const channelId = youtubeURI.split("/");

  // const channelID = extractChannelIDFromYoutubeURL(youtubeURI);
  // console.log(req.params, channelID);

  if (!channelId) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Channel ID",
    });
  }
  try {
    // console.log("inside");
    let params = {
      part: "snippet,contentDetails,statistics",
      key: process.env.YOUTUBE_API_KEY,
    };
    if (channelId[3] === "channel") {
      params.id = channelId[4];
    } else if (channelId[3] === "user") {
      params.forUsername = channelId[4];
    }
    let data = null;
    if (channelId[3] !== "c") {
      data = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
        params,
      });
    } else {
      const channelList = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            key: process.env.YOUTUBE_API_KEY,
            q: channelId[4],
            maxResults: 10,
            order: "relevance",
            type: "channel",
          },
        }
      );
      console.log(channelList);
      if (channelList.data.items.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Invalid Channel ID",
        });
      }
      params.id = channelList.data.items[0].id.channelId;
      data = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
        params,
      });
    }
    console.log(data.data);
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

export async function getBulkSubscriers(req, res) {
  const { youtubeURIList } = req.query;

  const channelURIParams = youtubeURIList.map((item) => {
    return { link: item, params: item.split("/") };
  });

  // const ChannelPromises =

  // const channelId = youtubeURI.split("/");

  // const channelID = extractChannelIDFromYoutubeURL(youtubeURI);
  // console.log(req.params, channelID);

  if (!channelId) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Channel ID",
    });
  }
  try {
    // console.log("inside");
    let params = {
      part: "snippet,contentDetails,statistics",
      key: process.env.YOUTUBE_API_KEY,
    };
    if (channelId[3] === "channel") {
      params.id = channelId[4];
    } else if (channelId[3] === "user") {
      params.forUsername = channelId[4];
    }
    let data = null;
    if (channelId[3] !== "c") {
      data = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
        params,
      });
    } else {
      const channelList = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            key: process.env.YOUTUBE_API_KEY,
            q: channelId[4],
            maxResults: 10,
            order: "relevance",
            type: "channel",
          },
        }
      );
      console.log(channelList);
      if (channelList.data.items.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Invalid Channel ID",
        });
      }
      params.id = channelList.data.items[0].id.channelId;
      data = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
        params,
      });
    }
    console.log(data.data);
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
