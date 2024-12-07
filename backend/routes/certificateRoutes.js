const express = require("express");
const {
  sendCertificatesEmail,
  generateAppreciationLetter,
  generateCertificates,
  sendAppreciationLetter
} = require("../controllers/certificateController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/restrictMiddleware");

const router = express.Router();

router.post(
  "/certificates/:id",
  protect,
  restrictTo(["admin"]),
  generateCertificates
);

router.post(
  "/appreciation-letters/:reviewerId",
  protect,
  restrictTo(["admin"]),
  generateAppreciationLetter
);

router.post('/certificates/:id/send', protect, restrictTo(['admin']), sendCertificatesEmail);

router.post('/appreciation-letters/:reviewerId/send', protect, restrictTo(['admin']), sendAppreciationLetter);

module.exports = router;
