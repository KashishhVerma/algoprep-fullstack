const router = require("express").Router();
const { getStreak, recordActivity } = require("../controllers/streakController");
const { protect } = require("../middleware/auth");
router.get("/",          protect, getStreak);
router.post("/activity", protect, recordActivity);
module.exports = router;
