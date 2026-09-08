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

const updateNoteController = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const result = await NotesModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    res.status(200).json({
      message: "Updated",
      data: result,
    });
  } catch (error) {
    console.log("Error in updating note", error);
    res.send("Error in updating");
  }
};

const singleUpdateNoteEntityController = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const result = await NotesModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    res.status(200).json({
      message: "UPdated",
      data: result,
    });
  } catch (error) {
    console.log("Error in updating single entity", error);
    res.send("Error in updating single entity", error);
  }
};

const deleteNoteController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await NotesModel.findOneAndDelete(id);

    res.status(200).json({
      message: "Deleted",
      data: result,
    });
  } catch (error) {
    console.log("Error in deleteing", error);
    res.send("Error in delteing", error);
  }
};

module.exports = {
  creaateNoteController,
  getAllNotesController,
  getSingleNoteController,
  updateNoteController,
  deleteNoteController,
  singleUpdateNoteEntityController
};
