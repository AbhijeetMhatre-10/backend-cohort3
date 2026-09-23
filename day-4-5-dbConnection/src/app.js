const express = require("express");
const connectDB = require("./config/db");
const NotesModel = require("./models/notes.model");

const app = express();
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Okay!?");
});

app.post("/create", async (req, res) => {
  try {
    const { title, desc } = req.body;

    const newNote = await NotesModel.create({
      title,
      desc,
    });

    res.send({
      success: true,
      message: "Ok got it",
      data: newNote,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = app;
