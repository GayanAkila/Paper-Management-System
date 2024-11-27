const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  deactivateUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/restrictMiddleware");

const router = express.Router();

router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);
router.put("/:id/role", protect, restrictTo(["admin"]), updateUserRole);
router.put("/:id/deactivate", protect, restrictTo(["admin"]), deactivateUser);

module.exports = router;
