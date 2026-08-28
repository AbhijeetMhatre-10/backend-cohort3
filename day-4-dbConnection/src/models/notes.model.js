const { default: mongoose } = require("mongoose");

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        minlength: 10
    }
})

const NotesModel = mongoose.model("Notes", notesSchema )

module.exports = NotesModel