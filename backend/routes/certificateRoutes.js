const express = require("express");
const multer = require('multer');
const {
  sendCertificatesEmail,
  generateAppreciationLetter,
  generateCertificates,
  handleAppreciationLetter,
  sendAppreciationLetter,
  handleCertificate
} = require("../controllers/certificateController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/restrictMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  // limits: { fileSize: 10 * 1024 * 1024 } // 5MB limit
})

const router = express.Router();

// router.post(
//   "/certificates/:id",
//   protect,
//   restrictTo(["admin"]),
//   generateCertificates
// );

router.post(
  "/appreciation-letters/:reviewerId",
  protect,
  restrictTo(["admin"]),
  generateAppreciationLetter
);

router.post('/:id/send', protect, restrictTo(['admin']), sendCertificatesEmail);

router.post('/:id', upload.array('certificates'), protect, restrictTo(['admin']), handleCertificate);

router.post('/appreciation-letters/:reviewerId', protect, restrictTo(['admin']), handleAppreciationLetter);

router.post('/appreciation-letters/:reviewerId/send', protect, restrictTo(['admin']), sendAppreciationLetter);

module.exports = router;
