const Streak = require("../models/Streak");

const getStreak = async (req, res) => {
  try {
    let s = await Streak.findOne({ user: req.user._id });
    if (!s) s = await Streak.create({ user: req.user._id });
    res.json({
      success: true,
      streak: {
        currentStreak:  s.currentStreak,
        maxStreak:      s.maxStreak,
        lastSolvedDate: s.lastSolvedDate,
        dailyLog:       Object.fromEntries(s.dailyLog),
      },
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const recordActivity = async (req, res) => {
  try {
    let s = await Streak.findOne({ user: req.user._id });
    if (!s) s = await Streak.create({ user: req.user._id });

    const today     = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (s.dailyLog.get(today)) {
      return res.json({ success: true, alreadyRecorded: true,
        streak: { currentStreak: s.currentStreak, maxStreak: s.maxStreak, lastSolvedDate: s.lastSolvedDate }
      });
    }

    s.dailyLog.set(today, true);
    if (s.lastSolvedDate === yesterday)    s.currentStreak += 1;
    else if (s.lastSolvedDate !== today)   s.currentStreak  = 1;
    s.lastSolvedDate = today;
    s.maxStreak = Math.max(s.maxStreak, s.currentStreak);
    await s.save();

    res.json({ success: true, streak: { currentStreak: s.currentStreak, maxStreak: s.maxStreak, lastSolvedDate: s.lastSolvedDate } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getStreak, recordActivity };
