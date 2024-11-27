const express = require("express");
const {
  generateCertificate,
  generateAppreciationLetter,
} = require("../controllers/certificateController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/restrictMiddleware");

const router = express.Router();

// router.post(
//   "/certificates/:id",
//   protect,
//   restrictTo(["admin"]),
//   generateCertificate
// );

// router.post(
//   "/appreciation-letters/:reviewerId",
//   protect,
//   restrictTo(["admin"]),
//   generateAppreciationLetter
// );

module.exports = router;
