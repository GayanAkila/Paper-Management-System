// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs if needed

// Initialize Firebase Admin SDK
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://paper-management-system-27228.firebaseio.com"
});

const db = admin.firestore();
const storage = admin.storage();

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Add a new paper (for students to submit)
app.post('/papers', async (req, res) => {
  try {
    const { title, student_id, file_url, type, members } = req.body;
    let certificates = [];

    if (type === 'project') {
      if (!members || members.length < 1 || members.length > 3) {
        return res.status(400).json({ error: 'Projects must have 1 to 3 members.' });
      }

      // Generate certificates for each project member
      certificates = members.map(member => ({
        member_name: member.name,
        certificate_url: '' // Placeholder for certificate URL to be generated later
      }));
    } else if (type === 'research') {
      certificates.push({
        member_name: req.body.student_name,
        certificate_url: '' // Placeholder for certificate URL to be generated later
      });
    }

    // Add the paper to Firestore
    const paperRef = await db.collection('papers').add({
      title,
      student_id,
      file_url,
      type,
      status: 'submitted',
      feedback: '',
      reviewer_id: '',
      submission_date: new Date().toISOString(),
      resubmission_date: null,
      certificates // Store certificate info for each member
    });

    res.status(201).json({ message: 'Paper submitted successfully', id: paperRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting paper', details: error });
  }
});

// Fetch all papers for a specific student
app.get('/papers/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const papersRef = await db.collection('papers').where('student_id', '==', student_id).get();

    if (papersRef.empty) {
      return res.status(404).json({ message: 'No papers found for this student' });
    }

    const papers = [];
    papersRef.forEach(doc => papers.push({ id: doc.id, ...doc.data() }));

    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching papers', details: error });
  }
});

// Update paper feedback (for reviewers)
app.put('/papers/:id/feedback', async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback, status, reviewer_id } = req.body;

    // Update the feedback for the paper
    await db.collection('papers').doc(id).update({
      feedback,
      status: status || 'reviewed',
      reviewer_id,
      resubmission_date: status === 'needs revision' ? new Date().toISOString() : null
    });

    // Generate appreciation letter if status is 'reviewed'
    if (status === 'reviewed') {
      const letterRef = db.collection('appreciation_letters').doc();
      await letterRef.set({
        reviewer_id,
        issue_date: new Date().toISOString(),
        pdf_url: '', // URL to the PDF file to be generated and stored in Firebase Storage
      });
    }

    res.status(200).json({ message: 'Feedback updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating feedback', details: error });
  }
});

// Delete paper (for rejecting papers)
app.delete('/papers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the paper
    await db.collection('papers').doc(id).delete();

    res.status(200).json({ message: 'Paper rejected and deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting paper', details: error });
  }
});

// Issue certificate or appreciation letter
app.post('/generate-certificate/:paper_id', async (req, res) => {
  try {
    const { paper_id } = req.params;
    const paperDoc = await db.collection('papers').doc(paper_id).get();

    if (!paperDoc.exists) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    const paperData = paperDoc.data();

    // Generate and upload certificates or appreciation letter to Firebase Storage
    for (let certificate of paperData.certificates) {
      // Placeholder for generating and uploading the PDF
      const pdfUrl = `https://firebasestorage.googleapis.com/v0/b/yourapp.appspot.com/o/certificates%2F${uuidv4()}.pdf?alt=media`;
      certificate.certificate_url = pdfUrl;
    }

    await db.collection('papers').doc(paper_id).update({ certificates: paperData.certificates });

    res.status(200).json({ message: 'Certificates issued successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error issuing certificate', details: error });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
