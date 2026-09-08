const express = require("express");
const upload = require("../config/multer");

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  try {
    const body = req.body
    const file = req.file
    console.log(body, "-", file)
    res.status(200).json({
      message: "Got you ",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
