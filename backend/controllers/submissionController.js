const { db, admin } = require("../firebase/firebaseConfig");
const { v4: uuidv4 } = require("uuid");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const sendEmail = require('../utils/emailService');

const KEYFILEPATH = path.join(__dirname, "../config/service-account-key.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

// @route   POST /api/v1/submissions
// @access  Private
exports.createSubmission = async (req, res) => {
  const submission = JSON.parse(req.body.submission);
  const file = req.file;

  if (!submission.type || !submission.title || !submission.authors || !file) {
    return res
      .status(400)
      .json({
        message: "All fields are required: type, title, authors, and file.",
      });
  }

  const allowedTypes = ["Research Paper", "Project"];
  if (!allowedTypes.includes(submission.type)) {
    return res
      .status(400)
      .json({
        message: `Invalid type. Allowed values are: ${allowedTypes.join(
          ", "
        )}.`,
      });
  }

  let parsedAuthors;
  try {
    parsedAuthors = Array.isArray(submission.authors) ? submission.authors : JSON.parse(submission.authors);
    console.log("Parsed authors:", parsedAuthors);
    if (!Array.isArray(parsedAuthors) || parsedAuthors.length < 1) {
      return res
        .status(400)
        .json({
          message: "Authors must be an array with at least one author.",
        });
    }

    if (submission.type === "Research Paper" && parsedAuthors.length !== 1) {
      return res
        .status(400)
        .json({ message: "Research Paper must have exactly 1 author." });
    }

    for (const author of parsedAuthors) {
      if (!author.name || !author.email) {
        return res
          .status(400)
          .json({ message: "Each author must have a name and email." });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(author.email)) {
        return res
          .status(400)
          .json({
            message: `Invalid email format for author: ${author.name}.`,
          });
      }
    }
  } catch (error) {
    console.log("Error parsing authors:", error);
    return res
      .status(400)
      .json({ message: "Invalid authors format. Must be a valid JSON array." });
  }

  try {
    const tempFilePath = path.join(
      __dirname,
      `../temp/${uuidv4()}_${file.originalname}`
    );
    fs.writeFileSync(tempFilePath, file.buffer);

    const response = await drive.files.create({
      requestBody: {
        name: `${uuidv4()}_${file.originalname}`,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(tempFilePath),
      },
    });

    const fileId = response.data.id;

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });

    const fileUrl = result.data.webViewLink;

    fs.unlinkSync(tempFilePath);

    const submissionData = {
      author: req.user.uid,
      type : submission.type,
      title : submission.title,
      authors: parsedAuthors,
      fileUrl,
      status: "submitted",
      createdAt: new Date().toISOString(),
    };

    const submissionRef = await db
      .collection("submissions")
      .add(submissionData);
    res.status(201).json({ submissionId: submissionRef.id });
  } catch (error) {
    console.error("Error in file upload or saving to Firestore:", error);
    res.status(500).json({ message: "Failed to create submission." });
  }
};

// @route   PUT /api/v1/submissions/:id/status
// @access  Private (Admin/Reviewer only)
exports.editSubmissionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  const allowedStatuses = [
    "submitted",
    "in review",
    "approved",
    "needs revision",
    "rejected",
  ];

  if (!status || !allowedStatuses.includes(status)) {
    return res
      .status(400)
      .json({
        message: `Invalid status. Allowed statuses are: ${allowedStatuses.join(
          ", "
        )}`,
      });
  }

  try {
    const submissionRef = db.collection("submissions").doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: "Submission not found." });
    }

    await submissionRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res
      .status(200)
      .json({ message: "Submission status updated successfully." });
  } catch (error) {
    console.error("Error updating submission status:", error);
    res.status(500).json({ message: "Failed to update submission status." });
  }
};

// @route   PUT /api/v1/submissions/:id
// @access  Private (Author only)
exports.editSubmission = async (req, res) => {
  const { id } = req.params; 
  const {authors, type, title} = JSON.parse(req.body.submission);
  
  try {
    const submissionRef = db.collection("submissions").doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: "Submission not found." });
    }

    const submission = submissionDoc.data();

    if (submission.author !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to edit this submission.",
      });
    }

    if (submission.status !== "submitted") {
      return res.status(400).json({
        message: "You can only edit a submission before it is reviewed.",
      });
    }

     

    const updateData = {
      updatedAt: new Date().toISOString(),
    };
    
    if (title) {
      updateData.title = title;
    }
    
    if (authors) {
      updateData.authors = authors;
    }

    if(type) {
      updateData.type = type;
    }
    
    await submissionRef.update(updateData);

    res.status(200).json({ message: "Submission updated successfully.", body: req.body, });
  } catch (error) {
    console.error("Error editing submission:", error);
    res.status(500).json({ message: "Failed to edit submission." });
  }
};

// @route   GET /api/v1/submissions/
// @access  Private (Author/Admin/Reviewer)
exports.getSubmission = async (req, res) => {
  try {
    const submissionsRef = db.collection("submissions")
    const snapshot = await submissionsRef.get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const submissions = [];
    snapshot.forEach(doc => {
      submissions.push({ id: doc.id, ...doc.data() });
    });
    // if (      
    //   req.user.role === "student"
    // ) {
    //   return res
    //     .status(403)
    //     .json({
    //       message: "You do not have permission to view submissions.",
    //     });
    // }

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions details:", error);
    res.status(500).json({ message: "Failed to fetch submission details." });
  }
};

// @route   GET /api/v1/submissions/by-author
// @access  Private
exports.getSubmissionsByAuthor = async (req, res) => {
  console.log("req.user: ",req.user);
  const authorId = req.user.uid;
  try {
    const submissionsRef = db.collection("submissions");
    const querySnapshot = await submissionsRef
      .where("author", "==", authorId)
      .get();

      if (querySnapshot.empty) {
        return res.status(200).json([]);
      }

    const submissions = [];
    querySnapshot.forEach((doc) => {
      submissions.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions by author:", error);
    res.status(500).json({ message: "Failed to fetch submissions by author." });
  }
};


// @route   POST /api/v1/submissions/:id/resubmit
// @access  Private (Author only)
exports.resubmitSubmission = async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  try {
    const submissionRef = db.collection("submissions").doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: "Submission not found." });
    }

    const submission = submissionDoc.data();

    if (submission.author !== req.user.uid) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to resubmit this submission.",
        });
    }

    if (submission.status !== "needs revision") {
      return res
        .status(400)
        .json({
          message: "You can only resubmit a submission that needs revision.",
        });
    }

    const tempFilePath = path.join(
      __dirname,
      `../temp/${uuidv4()}_${file.originalname}`
    );
    fs.writeFileSync(tempFilePath, file.buffer);

    const response = await drive.files.create({
      requestBody: {
        name: `${uuidv4()}_${file.originalname}`,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(tempFilePath),
      },
    });

    const fileId = response.data.id;

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });

    const fileUrl = result.data.webViewLink;

    fs.unlinkSync(tempFilePath);

    await submissionRef.update({
      fileUrl,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Submission resubmitted successfully." });
  } catch (error) {
    console.error("Error resubmitting submission:", error);
    res.status(500).json({ message: "Failed to resubmit submission." });
  }
};

// @route   POST /api/v1/submissions/:id/assign-reviewers
// @access  Private (Admin only)
exports.assignReviewers = async (req, res) => {
  const { id } = req.params;
  const { reviewers } = req.body; // Array of reviewer UIDs
  console.log("reviewers: ", req.body);
  if (!reviewers || !Array.isArray(reviewers) || reviewers.length < 1) {
    return res
      .status(400)
      .json({
        message: "Reviewers must be an array with at least one reviewer.",
      });
  }

  try {
    const submissionRef = db.collection("submissions").doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: "Submission not found." });
    }

    await submissionRef.update({
      reviewers,
      status: "in review",
      updatedAt: new Date().toISOString(),
    });

    const message = `You have been assigned to review a submission. Please log in to your account to view the submission and submit your review.`;
  
      for (const reviewer of reviewers) {
        await sendEmail({
          email: reviewer,
          subject: 'Assign a Paper to Review',
          message,
        });
      }
    
    res.status(200).json({ message: "Reviewers assigned successfully." });
  } catch (error) {
    console.error("Error assigning reviewers:", error);
    res.status(500).json({ message: "Failed to assign reviewers." });
  }
};

// @route   POST /api/v1/submissions/:id/review
// @access  Private (Reviewer only)
exports.submitReview = async (req, res) => {
  const { id } = req.params;
  const { comments, decision } = req.body;

  const allowedDecisions = ["approve", "needs revision", "reject"];
  console.log("req.body: ", req.body);

  

  if (!comments || !decision || !allowedDecisions.includes(decision)) {
    return res.status(400).json({
      message: `Invalid input. Comments are required and decision must be one of: ${allowedDecisions.join(
        ", "
      )}`,
    });
  }

  try {
    const submissionRef = db.collection("submissions").doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: "Submission not found." });
    }

    const submission = submissionDoc.data();
    console.log("req.user:", req.user);
    console.log("submission.reviewers:", submission.reviewers);

    if (
      !submission.reviewers ||
      !submission.reviewers.includes(req.user.email)
    ) {
      return res
        .status(403)
        .json({ message: "You are not assigned to review this submission." });
    }

      // Remove existing review from same reviewer
      const updatedReviews = (submission.reviews?.comments || []).filter(
        (review) => review.reviewer !== req.user.email
      );

    // await submissionRef.update({
    //   reviews: admin.firestore.FieldValue.arrayUnion({
    //     reviewer: req.user.email,
    //     comments,
    //     decision,
    //     submittedAt: new Date().toISOString(),
    //   }),
    // });

    
    const updatedData = {
      'reviews.comments': [...updatedReviews, {
        reviewer: req.user.email,
        comments,
        submittedAt: new Date().toISOString()
      }],
      'reviews.finalDecision': decision
    }

    await submissionRef.update(updatedData);

    switch(decision) {
      case 'approve':
        updatedData.status = 'approved';
        break;
      case 'needs revision':
        updatedData.status = 'needs revision';
        break;  
      case 'reject':
        updatedData.status = 'rejected';
        break;
    }

    await submissionRef.update(updatedData);
    
    res
      .status(200)
      .json({ message: "Review submitted successfully." });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Failed to submit review." });
  }
};

// @route   GET /api/v1/submissions/:id/reviews
// @access  Private (Admin/Reviewer only)
exports.getReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const submissionRef = db.collection("submissions").doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: "Submission not found." });
    }

    const submission = submissionDoc.data();

    if (req.user.role === "admin") {
      return res.status(200).json(submission.reviews || []);
    }

    if (req.user.role === "reviewer") {
      const userReviews = (submission.reviews || []).filter(
        (review) => review.reviewer === req.user.uid
      );
      return res.status(200).json(userReviews);
    }

    res
      .status(403)
      .json({ message: "You do not have permission to view these reviews." });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
};

// @route   POST /api/v1/submissions/:id/notify-result
// @access  Private (Admin only)
exports.notifyReviewResult = async (req, res) => {
  const { id } = req.params;

  try {
    const submissionRef = db.collection("submissions").doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: "Submission not found." });
    }

    const submission = submissionDoc.data();

    const allDecisions = (submission.reviews || []).map(
      (review) => review.decision
    );

    if (allDecisions.length < submission.reviewers.length) {
      return res
        .status(400)
        .json({
          message: "Not all reviewers have submitted their reviews yet.",
        });
    }

    const decisionCounts = allDecisions.reduce((acc, decision) => {
      acc[decision] = (acc[decision] || 0) + 1;
      return acc;
    }, {});

    const finalDecision = Object.keys(decisionCounts).reduce((a, b) =>
      decisionCounts[a] > decisionCounts[b] ? a : b
    );

    const author = submission.author;
    const feedback = submission.reviews.map((review) => ({
      reviewer: review.reviewer,
      comments: review.comments,
    }));

    console.log(
      `Notifying author ${author} with final decision: ${finalDecision}`
    );

    res
      .status(200)
      .json({
        message: "Author notified successfully.",
        finalDecision,
        feedback,
      });
  } catch (error) {
    console.error("Error notifying author:", error);
    res.status(500).json({ message: "Failed to notify author." });
  }
};

// @route   DELETE /api/v1/submissions/:id
// @access  Private (Author/Admin only)
exports.deleteSubmission = async (req, res) => {
  const { id } = req.params;

  try {
    const submissionRef = db.collection("submissions").doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: "Submission not found." });
    }

    const submission = submissionDoc.data();

    if (submission.author !== req.user.uid && req.user.role === "reviewer") {
      return res.status(403).json({
        message: "You do not have permission to delete this submission.",
      });
    }

    if(submission.status !== "submitted" && req.user.role !== "admin") {
      return res.status(400).json({
        message: "You can only delete a submission before it is reviewed.",
      });
    }

    await submissionRef.delete();

    res.status(200).json({ message: "Submission deleted successfully." });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ message: "Failed to delete submission." });
  }
};
