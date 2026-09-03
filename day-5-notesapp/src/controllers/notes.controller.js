const NotesModel = require("../models/notes.model");

const creaateNoteController = async (req, res) => {
  try {
    const { title, desc } = req.body;

    const newNote = await NotesModel.create({
      title,
      desc,
    });

    res.send(`Got ${newNote}`);
  } catch (error) {
    console.log("Error in create api->", error);
    res.send("Error in create api");
  }
};

const getAllNotesController = async (req, res) => {
  try {
    const result = await NotesModel.find();

    res.status(200).json({
      message: "All Notes Fetched",
      data: result,
    });
  } catch (error) {
    console.log("Error in fetching All notes", error);
    res.send("Error in fetching All notes");
  }
};

const getSingleNoteController = async (req, res) => {
  const { id } = req.params;

  const result = await NotesModel.findById(id);
  res.status(200).json({
    message: "Single Id Fetched",
    data: result,
  });
};

module.exports = {
  creaateNoteController,
  getAllNotesController,
  getSingleNoteController,
};
