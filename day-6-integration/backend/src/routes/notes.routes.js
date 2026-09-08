const express = require("express");
const {
  creaateNoteController,
  getAllNotesController,
  getSingleNoteController,
  updateNoteController,
  deleteNoteController,
  singleUpdateNoteEntityController,
} = require("../controllers/notes.controller");

const router = express.Router();

router.post("/create", creaateNoteController);

router.get("/getAllNotes", getAllNotesController);

router.get("/:id", getSingleNoteController);

router.patch("/:id/single", singleUpdateNoteEntityController);

router.put("/:id", updateNoteController);

router.delete("/:id", deleteNoteController);

module.exports = router;
