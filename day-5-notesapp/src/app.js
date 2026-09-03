const express = require("express");
const NotesModel = require("./models/notes.model");
const connectDB = require("./config/db");
const notesRoutes = require("./routes/notes.routes");
const app = express();
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Ok Got It");
});

app.use("/notes", notesRoutes);

module.exports = app;
