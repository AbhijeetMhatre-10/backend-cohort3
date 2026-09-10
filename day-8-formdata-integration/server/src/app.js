const express = require("express");
const fileRouter = require("./routes/file.route");
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}))

app.use("/file", fileRouter);

module.exports = app;
