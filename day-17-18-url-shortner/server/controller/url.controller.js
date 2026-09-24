import generateCode from "../utils/generateCode.js";
import UrlsModel from "../models/urls.model.js";

const createUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl || !longUrl.trim()) {
      return res.status(400).json({
        message: "Please enter a URL",
      });
    }

    if (longUrl.length > 2048) {
      return res.status(400).json({
        message: "URL is too long",
      });
    }

    if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
      return res.status(400).json({
        message: "Please enter a valid URL starting with http:// or https://",
      });
    }

    const oldUrl = await UrlsModel.findOne({ longUrl });

    if (oldUrl) {
      return res.status(200).json({
        message: "Link is already created.",
        data: {
          url: oldUrl,
        },
      });
    }

    const shortUrl = generateCode();

    const newUrl = await UrlsModel.create({
      shortUrl,
      longUrl,
    });

    return res.status(201).json({
      message: "Link created successfully.",
      data: {
        url: newUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in api",
      data: error,
    });
  }
};

const getAllUrls = async (req, res) => {
  try {
    const urls = await UrlsModel.find();

    res.status(200).json({
      message: "All urls fetched.",
      urls,
      urlsLength: urls.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const redirect = async (req, res) => {
  try {
    const { shortUrl } = req.params;

    const url = await UrlsModel.findOneAndUpdate(
      { shortUrl: shortUrl },
      { $inc: { clicks: 1 } },
    );

    if (!url) {
      return res.status(404).json({
        message: "Page not found.",
      });
    }

    return res.redirect(302, url.longUrl);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const url = await UrlsModel.findById(id);

    if (!url) {
      return res.status(200).json({
        message: "Url not found.",
      });
    }

    await UrlsModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Url deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export { createUrl, getAllUrls, redirect, deleteUrl };
