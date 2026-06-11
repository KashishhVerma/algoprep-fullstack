const router = require("express").Router();
const { getProgress, toggleSolved, toggleBookmark } = require("../controllers/progressController");
const { protect } = require("../middleware/auth");
router.get("/",                      protect, getProgress);
router.patch("/:problemId/solved",   protect, toggleSolved);
router.patch("/:problemId/bookmark", protect, toggleBookmark);
module.exports = router;
