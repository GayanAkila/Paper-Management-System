const PDFDocument = require('pdfkit');
const sendEmail = require('../utils/emailService');
const fs = require('fs');
const { db, bucket } = require('../firebase/firebaseConfig');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { generateCertificatePDF } = require('../utils/certificateGenerator');


// @desc    Generate and send certificates for approved submissions
// @route   POST /api/v1/certificates/:id
// @access  Private (Admin only)
exports.generateCertificates = async (req, res) => {
  const { id } = req.params; // Submission ID

  try {
    // Get submission data
    const submissionRef = db.collection('submissions').doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    const submission = submissionDoc.data();

    // Verify submission status
    if (submission.status !== 'approved' && submission.status !== 'needs revision') {
      return res.status(400).json({ 
        message: 'Certificates can only be generated for approved submissions.' 
      });
    }

    const certificateUrls = [];

    // Generate certificate for each author
    for (const author of submission.authors) {
      const { name, email } = author;
      const certificateId = uuidv4();

      // Prepare template data
      const templateData = {
        participantName: name,
        participantRole: submission.type === 'project' ? 'Project Author' : 'Research Paper Author',
        eventDate: 'December 15, 2024',
        deanName: 'Prof. John Doe',
        coordinatorName: 'Dr. Jane Smith',
        certificateId,
        // logoUrl: 'path/to/your/logo.png' // Update with actual logo path
      };

      // Generate PDF
      const pdfBuffer = await generateCertificatePDF(templateData);

      // Upload to Firebase Storage
      const fileName = `certificates/certificate_${certificateId}.pdf`;
      const file = bucket.file(fileName);
      
      await file.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf'
        }
      });

      // Make file public
      await file.makePublic();

      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // Add to certificate URLs array
      certificateUrls.push({
        name,
        email,
        certificateUrl: publicUrl,
        certificateId
      });
    }

    // Update submission with certificate URLs
    await submissionRef.update({
      certificateUrls,
      certificatesGeneratedAt: new Date()
    });

    res.status(200).json({
      message: 'Certificates generated and uploaded successfully.',
      certificateUrls
    });

  } catch (error) {
    console.error('Error generating certificates:', error);
    res.status(500).json({ message: 'Failed to generate certificates.' });
  }
};

// @desc    Generate and send appreciation letters for reviewers
// @route   POST /api/v1/appreciation-letters/:reviewerId
// @access  Private (Admin only)
// exports.generateAppreciationLetter = async (req, res) => {
//   const { reviewerId } = req.params;

//   try {
//     const reviewerRef = db.collection('users').doc(reviewerId);
//     const reviewerDoc = await reviewerRef.get();

//     if (!reviewerDoc.exists) {
//       return res.status(404).json({ message: 'Reviewer not found.' });
//     }

//     const reviewer = reviewerDoc.data();
//     console.log(reviewer.email);
//     // Fetch all submissions reviewed by the reviewer
//     const submissionsSnapshot = await db
//       .collection('submissions')
//       .where('reviews', 'array-contains', { reviewer: reviewer.email })
//       .get();
//     console.log(`Found ${submissionsSnapshot.size} reviews for reviewer: ${reviewerId}`);
//     if (submissionsSnapshot.empty) {
//       return res.status(404).json({ message: 'No reviews found for this reviewer.' });
//     }

//     const reviewedSubmissions = [];
//     submissionsSnapshot.forEach((doc) => reviewedSubmissions.push(doc.data()));

//     // Generate appreciation letter PDF
//     const doc = new PDFDocument();
//     const filePath = path.join(__dirname, `../temp/appreciation_letter_${reviewerId}.pdf`);
//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     // Add letter content
//     doc
//       .fontSize(20)
//       .text('Appreciation Letter', { align: 'center' })
//       .moveDown()
//       .fontSize(14)
//       .text(`Dear ${reviewer.name},`, { align: 'left' })
//       .moveDown()
//       .text('We sincerely appreciate your valuable contributions as a reviewer.', { align: 'left' })
//       .text('You have reviewed the following submissions:', { align: 'left' })
//       .moveDown();

//     reviewedSubmissions.forEach((submission, index) => {
//       doc.text(`${index + 1}. ${submission.title} (${submission.type})`, { align: 'left' });
//     });

//     doc.end();

//     // Wait for the file to finish writing
//     writeStream.on('finish', async () => {
//       // Save the appreciation letter file URL in Firestore
//       await db.collection('users').doc(reviewerId).update({
//         appreciationLetterUrl: `https://your-storage-service/appreciation_letters/appreciation_letter_${reviewerId}.pdf`,
//       });

//       // Optionally, send the letter via email (email service required)
//       console.log(`Appreciation letter generated and saved for reviewer: ${reviewerId}`);
//       res.status(200).json({ message: 'Appreciation letter generated successfully.' });
//     });
//   } catch (error) {
//     console.error('Error generating appreciation letter:', error);
//     res.status(500).json({ message: 'Failed to generate appreciation letter.' });
//   }
// };



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

 // @desc    Upload certificate and send emails
// @route   POST /api/v1/certificates/:id
// @access  Private (Admin only)
exports.handleCertificate = async (req, res) => {
  const { id } = req.params;
  const certificateFiles = req.files; // Array of files from multer

  if (!certificateFiles || certificateFiles.length === 0) {
    return res.status(400).json({ message: 'No certificate files provided.' });
  }

  try {
    const submissionRef = db.collection('submissions').doc(id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    const submission = submissionDoc.data();

    if (submission.status !== 'approved' && submission.status !== 'needs revision') {
      return res.status(400).json({ 
        message: 'Certificates can only be generated for approved submissions.' 
      });
    }

    const certificateUrls = [];

    // Process each certificate file
    for (let i = 0; i < certificateFiles.length; i++) {
      const file = certificateFiles[i];
      const author = submission.authors[i];

      if (!author) {
        console.warn(`No author found for file index ${i}`);
        continue;
      }

      // Upload to Firebase Storage
      const certificateId = uuidv4();
      const fileName = `certificates/certificate_${certificateId}.pdf`;
      const storageFile = bucket.file(fileName);
      
      await storageFile.save(file.buffer, {
        metadata: { contentType: 'application/pdf' }
      });

      // Make file public and get URL
      await storageFile.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // Add to certificate URLs array
      certificateUrls.push({
        name: author.name,
        email: author.email,
        certificateUrl: publicUrl,
        certificateId
      });

      // Send email to author
      const emailData = {
        email: author.email,
        subject: 'Your Paper Certificate - BISSS',
        message: `
          Dear ${author.name},

          Congratulations! Your paper "${submission.title}" has been approved.
          Please find your certificate click here ${publicUrl}.

          Best regards,
          BISSS Team
        `,
       
      };

      await sendEmail(emailData);
    }

    // Update submission document
    await submissionRef.update({
      certificateUrls,
      certificatesGeneratedAt: new Date(),
      certificatesEmailed: true,
      certificatesEmailedAt: new Date()
    });

    res.status(200).json({
      message: 'Certificates uploaded and emails sent successfully.',
      certificateUrls
    });

  } catch (error) {
    console.error('Error processing certificates:', error);
    res.status(500).json({ 
      message: 'Failed to process certificates.',
      error: error.message 
    });
  }
};

// @desc    Upload appreciation letter and send email
// @route   POST /api/v1/appreciation-letters/:reviewerId
// @access  Private (Admin only)
exports.handleAppreciationLetter = async (req, res) => {
  const { reviewerId } = req.params;
  const letterFile = req.file; 

  if (!letterFile) {
    return res.status(400).json({ message: 'No appreciation letter file provided.' });
  }

  try {
    const reviewerRef = db.collection('users').doc(reviewerId);
    const reviewerDoc = await reviewerRef.get();

    if (!reviewerDoc.exists) {
      return res.status(404).json({ message: 'Reviewer not found.' });
    }

    const reviewer = reviewerDoc.data();

    // Fetch all submissions reviewed by this reviewer
    // const submissionsSnapshot = await db
    //   .collection('submissions')
    //   .where('reviews', 'array-contains', { reviewer: reviewer.email })
    //   .get();

    // if (submissionsSnapshot.empty) {
    //   return res.status(404).json({ message: 'No reviews found for this reviewer.' });
    // }

    // Upload to Firebase Storage
    const letterId = uuidv4();
    const fileName = `appreciation_letters/letter_${letterId}.pdf`;
    const storageFile = bucket.file(fileName);
    
    await storageFile.save(letterFile.buffer, {
      metadata: { contentType: 'application/pdf' }
    });

    // Make file public and get URL
    await storageFile.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Send email to reviewer
    const emailData = {
      email: reviewer.email,
      subject: 'Appreciation Letter - BISSS',
      message: `
        Dear ${reviewer.name},

        Thank you for your valuable contributions as a reviewer for the Business Information System Student Symposium (BISSS).
        Please find your appreciation letter click here ${publicUrl}.

        Best regards,
        BISSS Team
      `,
    };

    await sendEmail(emailData);

    // Update reviewer document with letter information
    await reviewerRef.update({
      appreciationLetterUrl: publicUrl,
      letterId,
      letterGeneratedAt: new Date(),
      letterEmailed: true,
      letterEmailedAt: new Date(),
      // reviewedSubmissions: submissionsSnapshot.docs.map(doc => ({
      //   id: doc.id,
      //   title: doc.data().title,
      //   type: doc.data().type
      // }))
    });

    res.status(200).json({
      message: 'Appreciation letter uploaded and email sent successfully.',
      letterUrl: publicUrl
    });

  } catch (error) {
    console.error('Error processing appreciation letter:', error);
    res.status(500).json({ 
      message: 'Failed to process appreciation letter.',
      error: error.message 
    });
  }
};