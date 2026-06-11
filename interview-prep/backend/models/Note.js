const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:   { type: String, required: true, trim: true, maxlength: 100 },
  content: { type: String, default: "" },
  topic:   { type: String, default: "General" },
}, { timestamps: true });

noteSchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model("Note", noteSchema);
