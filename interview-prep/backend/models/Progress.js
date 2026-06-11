const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  problemId:  { type: String },
  solved:     { type: Boolean, default: false },
  bookmarked: { type: Boolean, default: false },
  solvedAt:   { type: Date, default: null },
}, { _id: false });

const progressSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  problems: { type: Map, of: problemSchema, default: {} },
}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);
