const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  deactivateUser,
  getAllUsers,
  updateUser,
  deleteUser
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/restrictMiddleware");


const router = express.Router();

router.get("/me", protect, getUserProfile);
router.get("", protect, restrictTo(["admin"]), getAllUsers);
router.put("/me", protect, updateUserProfile);
router.put("/:id/role", protect, restrictTo(["admin"]), updateUserRole);
router.put("/:id/deactivate", protect, restrictTo(["admin"]), deactivateUser);
router.put("/:id/", protect, restrictTo(["admin"]), updateUser);
router.delete("/:id", protect, restrictTo(["admin"]), deleteUser);


module.exports = router;
