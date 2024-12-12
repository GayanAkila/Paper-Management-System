const express = require("express");

const {
  handleAppreciationLetter,
  handleCertificate
} = require("../controllers/certificateController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/restrictMiddleware");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// const storage = multer.memoryStorage();
// const upload = multer({ 
//   storage,
//   // limits: { fileSize: 10 * 1024 * 1024 } // 5MB limit
// })

const router = express.Router();


router.post('/:id', upload.array('certificates'), protect, restrictTo(['admin']), handleCertificate);

router.post('/appreciation-letters/:reviewerId', protect,upload.single("file"), restrictTo(['admin']), handleAppreciationLetter);

module.exports = router;
