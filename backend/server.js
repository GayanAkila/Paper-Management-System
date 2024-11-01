// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

// Initialize Firebase Admin SDK
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://paper-management-system-27228.firebaseio.com",
  storageBucket: "paper-management-system-27228.appspot.com" // Add your bucket name
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Add a new paper (for students to submit)
app.post('/papers', upload.single('file'), async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file' });
    }

    const { title, student_id, type, student_name, members } = req.body;
    let certificates = [];

    // Upload file to Firebase Storage
    const fileName = `papers/${Date.now()}_${req.file.originalname}`;
    const fileBuffer = req.file.buffer;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: 'application/pdf'
      }
    });

    blobStream.on('error', (error) => {
      res.status(500).json({ error: 'Unable to upload file', details: error });
    });

    blobStream.on('finish', async () => {
      // Get the public URL
      const file_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // Process certificates based on paper type
      if (type === 'project') {
        const membersList = typeof members === 'string' ? JSON.parse(members) : members;
        if (!membersList || membersList.length < 1 || membersList.length > 3) {
          return res.status(400).json({ error: 'Projects must have 1 to 3 members.' });
        }

        certificates = membersList.map(member => ({
          member_name: member.name,
          certificate_url: '' // Placeholder for certificate URL
        }));
      } else if (type === 'research') {
        certificates.push({
          member_name: student_name,
          certificate_url: '' // Placeholder for certificate URL
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
        certificates
      });

      res.status(201).json({ 
        message: 'Paper submitted successfully', 
        id: paperRef.id,
        file_url 
      });
    });

    blobStream.end(fileBuffer);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error submitting paper', details: error.message });
  }
});

// Rest of your existing endpoints remain the same...

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
        pdf_url: '', // URL to the PDF file to be generated
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

    // Get paper data to delete file from storage
    const paper = await db.collection('papers').doc(id).get();
    if (paper.exists) {
      const paperData = paper.data();
      if (paperData.file_url) {
        // Extract filename from URL and delete from storage
        const fileName = paperData.file_url.split('/').pop();
        await bucket.file(`papers/${fileName}`).delete().catch(console.error);
      }
    }

    // Delete the paper document
    await db.collection('papers').doc(id).delete();

    res.status(200).json({ message: 'Paper rejected and deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting paper', details: error });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});