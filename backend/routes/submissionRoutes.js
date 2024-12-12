const express = require("express");
const {
  createSubmission,
  editSubmission,
  getSubmission,
  getSubmissionsByAuthor,
  editSubmissionStatus,
  resubmitSubmission,
  assignReviewers,
  submitReview,
  getReviews,
  notifyReviewResult,deleteSubmission
} = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/restrictMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/", protect, upload.single("file"), createSubmission);

router.get("/by-author", protect, getSubmissionsByAuthor);

router.put("/:id", protect, editSubmission);

router.get("/", protect, getSubmission);

router.put(
  "/:id/status",
  protect,
  restrictTo(["admin", "reviewer"]),
  editSubmissionStatus
);

router.post(
  "/:id/resubmit",
  protect,
  upload.single("file"),
  resubmitSubmission
);

router.post(
  "/:id/assign-reviewers",
  protect,
  restrictTo(["admin"]),
  assignReviewers
);

router.post("/:id/review", protect,upload.single("file"), restrictTo(["reviewer"]), submitReview);

router.get(
  "/:id/reviews",
  protect,
  restrictTo(["admin", "reviewer"]),
  getReviews
);

router.post(
  "/:id/notify-result",
  protect,
  restrictTo(["admin"]),
  notifyReviewResult
);

router.delete("/:id", protect, deleteSubmission);

module.exports = router;
