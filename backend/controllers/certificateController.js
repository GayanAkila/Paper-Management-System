const PDFDocument = require('pdfkit');
const sendEmail = require('../utils/emailService');
const fs = require('fs');
const { db, bucket } = require('../firebase/firebaseConfig');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// @desc    Generate and send certificates for approved submissions
// @route   POST /api/v1/certificates/:id
// @access  Private (Admin only)
exports.generateCertificates = async (req, res) => {
  const { id } = req.params; // Submission ID

  try {
    const submissionRef = db.collection('submissions').doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    const submission = submissionDoc.data();
    if (submission.status !== 'approved' && submission.status !== 'needs revision') {
      return res.status(400).json({ message: 'Certificates can only be generated for approved submissions.' });
    }

    // Array to store certificate URLs
    const certificateUrls = [];

    for (const author of submission.authors) {
      const { name, email } = author;

      // Generate a unique filename for each author's certificate
      const fileName = `certificates/certificate_${uuidv4()}.pdf`;

      // Generate certificate PDF
      const doc = new PDFDocument();
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir); // Ensure the temp directory exists
      }
      const localFilePath = path.join(tempDir, path.basename(fileName));
      const writeStream = fs.createWriteStream(localFilePath);
      doc.pipe(writeStream);

      // Add certificate content
      doc
        .fontSize(20)
        .text('Certificate of Approval', { align: 'center' })
        .moveDown()
        .fontSize(14)
        .text(`This is to certify that ${name}`, { align: 'center' })
        .text(`(${email})`, { align: 'center' })
        .moveDown()
        .text(`is recognized as an author of the submission titled "${submission.title}"`, { align: 'center' })
        .text(`(${submission.type}), which has been approved.`, { align: 'center' })
        .moveDown();

      doc.end();

      // Wait for the file to finish writing locally
      await new Promise((resolve) => writeStream.on('finish', resolve));

      console.log(`Certificate saved locally at: ${localFilePath}`);

      // Upload file to Google Cloud Storage
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream();

      await new Promise((resolve, reject) => {
        blobStream.on('finish', resolve);
        blobStream.on('error', reject);
        blobStream.end(fs.readFileSync(localFilePath));
      });

      // Make the file publicly accessible
      await blob.makePublic();

      // Get the public URL of the uploaded file
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // Add to certificate URLs array
      certificateUrls.push({
        name,
        email,
        certificateUrl: publicUrl,
      });

      // Clean up the temporary local file
      fs.unlinkSync(localFilePath);
    }

    // Save certificate URLs to Firestore
    await submissionRef.update({
      certificateUrls,
    });

    console.log('Certificates generated and uploaded for all authors.');
    res.status(200).json({
      message: 'Certificates generated and uploaded successfully.',
      certificateUrls,
    });
  } catch (error) {
    console.error('Error generating certificates:', error);
    res.status(500).json({ message: 'Failed to generate certificates.' });
  }
};

// @desc    Generate and send appreciation letters for reviewers
// @route   POST /api/v1/appreciation-letters/:reviewerId
// @access  Private (Admin only)
exports.generateAppreciationLetter = async (req, res) => {
  const { reviewerId } = req.params;

  try {
    const reviewerRef = db.collection('users').doc(reviewerId);
    const reviewerDoc = await reviewerRef.get();

    if (!reviewerDoc.exists) {
      return res.status(404).json({ message: 'Reviewer not found.' });
    }

    const reviewer = reviewerDoc.data();
    console.log(reviewer.email);
    // Fetch all submissions reviewed by the reviewer
    const submissionsSnapshot = await db
      .collection('submissions')
      .where('reviews', 'array-contains', { reviewer: reviewer.email })
      .get();
    console.log(`Found ${submissionsSnapshot.size} reviews for reviewer: ${reviewerId}`);
    if (submissionsSnapshot.empty) {
      return res.status(404).json({ message: 'No reviews found for this reviewer.' });
    }

    const reviewedSubmissions = [];
    submissionsSnapshot.forEach((doc) => reviewedSubmissions.push(doc.data()));

    // Generate appreciation letter PDF
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../temp/appreciation_letter_${reviewerId}.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Add letter content
    doc
      .fontSize(20)
      .text('Appreciation Letter', { align: 'center' })
      .moveDown()
      .fontSize(14)
      .text(`Dear ${reviewer.name},`, { align: 'left' })
      .moveDown()
      .text('We sincerely appreciate your valuable contributions as a reviewer.', { align: 'left' })
      .text('You have reviewed the following submissions:', { align: 'left' })
      .moveDown();

    reviewedSubmissions.forEach((submission, index) => {
      doc.text(`${index + 1}. ${submission.title} (${submission.type})`, { align: 'left' });
    });

    doc.end();

    // Wait for the file to finish writing
    writeStream.on('finish', async () => {
      // Save the appreciation letter file URL in Firestore
      await db.collection('users').doc(reviewerId).update({
        appreciationLetterUrl: `https://your-storage-service/appreciation_letters/appreciation_letter_${reviewerId}.pdf`,
      });

      // Optionally, send the letter via email (email service required)
      console.log(`Appreciation letter generated and saved for reviewer: ${reviewerId}`);
      res.status(200).json({ message: 'Appreciation letter generated successfully.' });
    });
  } catch (error) {
    console.error('Error generating appreciation letter:', error);
    res.status(500).json({ message: 'Failed to generate appreciation letter.' });
  }
};



// @desc    Send certificates via email
// @route   POST /api/v1/certificates/:id/send
// @access  Private (Admin only)
exports.sendCertificatesEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const submissionRef = db.collection('submissions').doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    const submission = submissionDoc.data();
    const { certificateUrls } = submission;

    if (!certificateUrls || certificateUrls.length === 0) {
      return res.status(400).json({ 
        message: 'No certificates found. Please generate certificates first.' 
      });
    }

    // Send email to each author
    for (const certificate of certificateUrls) {
      const { email, name, certificateUrl } = certificate;
      
      const message = `
        Dear ${name},

        Congratulations! Your paper "${submission.title}" has been approved.
        Please find your certificate at the following link:
        ${certificateUrl}

        Best regards,
        BIS Team
      `;

      await sendEmail({
        email,
        subject: 'Your Paper Certificate',
        message
      });
    }

    await submissionRef.update({
      certificatesEmailed: true,
      certificatesEmailedAt: new Date().toISOString()
    });

    res.status(200).json({ 
      message: 'Certificates sent successfully to all authors.' 
    });

  } catch (error) {
    console.error('Error sending certificate emails:', error);
    res.status(500).json({ 
      message: 'Failed to send certificate emails.' 
    });
  }
};


// @desc    Send appreciation letter via email
// @route   POST /api/v1/appreciation-letters/:reviewerId/send
// @access  Private (Admin only)
exports.sendAppreciationLetter = async (req, res) => {
  const { reviewerId } = req.params;
 
  try {
    const userRef = db.collection('users').doc(reviewerId);
    const userDoc = await userRef.get();
 
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Reviewer not found' });
    }
 
    const reviewer = userDoc.data();
    if (!reviewer.appreciationLetterUrl) {
      return res.status(400).json({
        message: 'No appreciation letter found. Please generate one first.'
      });
    }
 
    const message = `
      Dear ${reviewer.name},
 
      Thank you for your valuable contributions as a reviewer. 
      Please find your appreciation letter at:
      ${reviewer.appreciationLetterUrl}
 
      Best regards,
      BIS Team
    `;
 
    await sendEmail({
      email: reviewer.email,
      subject: 'Reviewer Appreciation Letter',
      message
    });
 
    await userRef.update({
      letterEmailed: true,
      letterEmailedAt: new Date().toISOString()
    });
 
    res.status(200).json({
      message: 'Appreciation letter sent successfully.'
    });
 
  } catch (error) {
    console.error('Error sending appreciation letter:', error);
    res.status(500).json({
      message: 'Failed to send appreciation letter.'
    });
  }
 };