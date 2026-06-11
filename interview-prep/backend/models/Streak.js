const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  currentStreak:  { type: Number, default: 0 },
  maxStreak:      { type: Number, default: 0 },
  lastSolvedDate: { type: String, default: null },
  dailyLog:       { type: Map, of: Boolean, default: {} },
}, { timestamps: true });

module.exports = mongoose.model("Streak", streakSchema);
