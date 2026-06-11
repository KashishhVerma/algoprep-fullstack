const Note = require("../models/Note");

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const createNote = async (req, res) => {
  try {
    const { title, content, topic } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title required" });
    const note = await Note.create({ user: req.user._id, title, content, topic });
    res.status(201).json({ success: true, note });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    const { title, content, topic } = req.body;
    if (title   !== undefined) note.title   = title;
    if (content !== undefined) note.content = content;
    if (topic   !== undefined) note.topic   = topic;
    await note.save();
    res.json({ success: true, note });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    res.json({ success: true, message: "Note deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
