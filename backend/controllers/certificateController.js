const PDFDocument = require('pdfkit');
const { db } = require('../firebase/firebaseConfig');
const path = require('path');
const fs = require('fs');

// @route   POST /api/v1/certificates/:id
// @access  Private (Admin only)
// exports.generateCertificate = async (req, res) => {
//   const { id } = req.params; // Submission ID

//   try {
//     const submissionRef = db.collection('submissions').doc(id);
//     const submissionDoc = await submissionRef.get();

//     if (!submissionDoc.exists) {
//       return res.status(404).json({ message: 'Submission not found.' });
//     }

//     const submission = submissionDoc.data();

//     if (submission.status !== 'approved') {
//       return res.status(400).json({ message: 'Certificates can only be generated for approved submissions.' });
//     }

//     const doc = new PDFDocument();
//     const filePath = path.join(__dirname, `../temp/certificate_${id}.pdf`);
//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     doc
//       .fontSize(20)
//       .text('Certificate of Approval', { align: 'center' })
//       .moveDown()
//       .fontSize(14)
//       .text(`This is to certify that the submission titled "${submission.title}"`, { align: 'center' })
//       .text(`(${submission.type}) by the following author(s) has been approved.`, { align: 'center' })
//       .moveDown();

//     submission.authors.forEach((author) => {
//       doc.text(`${author.name} (${author.email})`, { align: 'center' });
//     });

//     doc.end();

//     writeStream.on('finish', async () => {
//       await db.collection('submissions').doc(id).update({
//         certificateUrl: `https://your-storage-service/certificates/certificate_${id}.pdf`,
//       });

//       console.log(`Certificate generated and saved for submission: ${id}`);
//       res.status(200).json({ message: 'Certificate generated successfully.' });
//     });
//   } catch (error) {
//     console.error('Error generating certificate:', error);
//     res.status(500).json({ message: 'Failed to generate certificate.' });
//   }
// };

// @route   POST /api/v1/appreciation-letters/:reviewerId
// @access  Private (Admin only)
// exports.generateAppreciationLetter = async (req, res) => {
//     const { reviewerId } = req.params;
  
//     try {
//       const reviewerRef = db.collection('users').doc(reviewerId);
//       const reviewerDoc = await reviewerRef.get();
  
//       if (!reviewerDoc.exists) {
//         return res.status(404).json({ message: 'Reviewer not found.' });
//       }
  
//       const reviewer = reviewerDoc.data();
  
//       const submissionsSnapshot = await db
//         .collection('submissions')
//         .where('reviews', 'array-contains', { reviewer: reviewer.email })
//         .get();
  
//       if (submissionsSnapshot.empty) {
//         return res.status(404).json({ message: 'No reviews found for this reviewer.' });
//       }
  
//       const reviewedSubmissions = [];
//       submissionsSnapshot.forEach((doc) => reviewedSubmissions.push(doc.data()));
  
//       const doc = new PDFDocument();
//       const filePath = path.join(__dirname, `../temp/appreciation_letter_${reviewerId}.pdf`);
//       const writeStream = fs.createWriteStream(filePath);
//       doc.pipe(writeStream);
  
//       doc
//         .fontSize(20)
//         .text('Appreciation Letter', { align: 'center' })
//         .moveDown()
//         .fontSize(14)
//         .text(`Dear ${reviewer.name},`, { align: 'left' })
//         .moveDown()
//         .text('We sincerely appreciate your valuable contributions as a reviewer.', { align: 'left' })
//         .text('You have reviewed the following submissions:', { align: 'left' })
//         .moveDown();
  
//       reviewedSubmissions.forEach((submission, index) => {
//         doc.text(`${index + 1}. ${submission.title} (${submission.type})`, { align: 'left' });
//       });
  
//       doc.end();
  
//       writeStream.on('finish', async () => {
//         await db.collection('users').doc(reviewerId).update({
//           appreciationLetterUrl: `https://your-storage-service/appreciation_letters/appreciation_letter_${reviewerId}.pdf`,
//         });
  
//         console.log(`Appreciation letter generated and saved for reviewer: ${reviewerId}`);
//         res.status(200).json({ message: 'Appreciation letter generated successfully.' });
//       });
//     } catch (error) {
//       console.error('Error generating appreciation letter:', error);
//       res.status(500).json({ message: 'Failed to generate appreciation letter.' });
//     }
//   };
  