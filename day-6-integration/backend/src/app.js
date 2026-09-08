const express = require("express");
const NotesModel = require("./models/notes.model");
const cors = require("cors");
const connectDB = require("./config/db");
const notesRoutes = require("./routes/notes.routes");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Ok Got It");
});

app.use("/notes", notesRoutes);

module.exports = app;
