const express = require("express");
const upload = require("../config/multer.config");

const fileRouter = express.Router();

fileRouter.post("/", upload.single("image"), (req, res) => {
    try {
        console.log(req.file);
        res.send("Image uploaded");
    } catch (error) {
        console.log(error);
        res.status(500).send("Upload failed");
    }
});

module.exports = fileRouter;
