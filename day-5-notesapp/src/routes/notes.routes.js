const express = require("express");
const {
  creaateNoteController,
  getAllNotesController,
  getSingleNoteController,
} = require("../controllers/notes.controller");
const NotesModel = require("../models/notes.model");

const router = express.Router();

router.post("/create", creaateNoteController);
router.get("/getAllNotes", getAllNotesController);
router.get("/:id", getSingleNoteController);

module.exports = router;
