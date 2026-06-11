const Progress = require("../models/Progress");

const getProgress = async (req, res) => {
  try {
    let p = await Progress.findOne({ user: req.user._id });
    if (!p) p = await Progress.create({ user: req.user._id });
    res.json({ success: true, progress: Object.fromEntries(p.problems) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const toggleSolved = async (req, res) => {
  try {
    const { problemId } = req.params;
    let p = await Progress.findOne({ user: req.user._id });
    if (!p) p = await Progress.create({ user: req.user._id });

    const cur = p.problems.get(problemId) || { solved: false, bookmarked: false };
    const nowSolved = !cur.solved;
    p.problems.set(problemId, { ...cur, solved: nowSolved, solvedAt: nowSolved ? new Date() : null });
    await p.save();

    res.json({ success: true, problemId, solved: nowSolved });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const toggleBookmark = async (req, res) => {
  try {
    const { problemId } = req.params;
    let p = await Progress.findOne({ user: req.user._id });
    if (!p) p = await Progress.create({ user: req.user._id });

    const cur = p.problems.get(problemId) || { solved: false, bookmarked: false };
    p.problems.set(problemId, { ...cur, bookmarked: !cur.bookmarked });
    await p.save();

    res.json({ success: true, problemId, bookmarked: !cur.bookmarked });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getProgress, toggleSolved, toggleBookmark };
