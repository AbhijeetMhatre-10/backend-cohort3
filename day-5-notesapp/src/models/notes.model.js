const mongoose = require('mongoose')

const NotesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 3
    },
    desc:{
        type: String,
        minlength: [10, "Minimum 10 characters required."]
    }
})

const NotesModel = mongoose.model("Notes", NotesSchema)

module.exports = NotesModel