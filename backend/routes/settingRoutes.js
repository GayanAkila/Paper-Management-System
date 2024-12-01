const express = require("express");

const {
    addDeadline,
    updateDeadline,getDeadline

  } = require("../controllers/settingController");

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/restrictMiddleware");

const router = express.Router();

router.post("/deadline-add", protect, restrictTo(["admin"]), addDeadline);
router.put("/deadline-update", protect, restrictTo(["admin"]), updateDeadline);
router.get("/deadlines", protect, getDeadline);

module.exports = router;
