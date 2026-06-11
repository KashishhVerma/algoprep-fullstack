const router = require("express").Router();
const { getNotes, createNote, updateNote, deleteNote } = require("../controllers/notesController");
const { protect } = require("../middleware/auth");
router.get("/",       protect, getNotes);
router.post("/",      protect, createNote);
router.put("/:id",    protect, updateNote);
router.delete("/:id", protect, deleteNote);
module.exports = router;
