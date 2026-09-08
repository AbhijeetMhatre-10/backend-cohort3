import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const App = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [notes, setNotes] = useState([])

  const handleAddNote = async () => {
    if (!title.trim() || !desc.trim()) return;

    const newNote = {
      title,
      desc,
    };

    const result = await axios.post(
      "http://localhost:3000/notes/create",
      newNote,
    );

    setTitle("");
    setDesc("");
  };

  useEffect(() => {
  const getNotes = async () => {
    const result = await axios.get(
      "http://localhost:3000/notes/getAllNotes"
    );


    setNotes(result.data.data);
  };

  getNotes();
}, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Notes App</h1>

        <div className="rounded-lg bg-white p-5 shadow">
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-3 w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
          />

          <textarea
            placeholder="Enter description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows="4"
            className="mb-3 w-full resize-none rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
          />

          <button
            onClick={handleAddNote}
            className="cursor-pointer rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Add Note
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg bg-white p-5 shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {note.title}
              </h2>

              <p className="mt-2 text-gray-600">
                {note.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
