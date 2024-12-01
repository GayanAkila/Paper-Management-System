const { admin, db } = require("../firebase/firebaseConfig");


// @route   POST /api/v1/settings/add-deadline
// @access  Private
exports.addDeadline = async (req, res) => {
  const { type, deadline } = req.body;
 
  try {
    const deadlineRef = db.collection('deadlines').doc(type);
    const deadlineDoc = await deadlineRef.get();
 
    if (deadlineDoc.exists) {
      return res.status(400).json({message: 'Deadline already exists'});
    }
 
    await deadlineRef.set({
      deadline: new Date(deadline).toString(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
 
    res.status(201).json({message: 'Deadline added successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
 };

// @route   POST /api/v1/settings/update-deadlines
// @access  Private
exports.updateDeadline = async (req, res) => {
  const { type, deadline } = req.body;
 
  try {
    const deadlineRef = db.collection('deadlines').doc(type); 
    const deadlineDoc = await deadlineRef.get();
 
    if (!deadlineDoc.exists) {
      console.log('here')
      return res.status(404).json({message: 'Deadline not found'});
    }
 
    await deadlineRef.update({
      deadline: new Date(deadline).toString(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
 
    res.status(200).json({message: 'Deadline updated successfully'});
  } catch (error) {
    res.status(500).json({message: error.message}); 
  }
 };

// @route   GET /api/v1/settings/deadlines
// @access  Private
exports.getDeadline = async (req, res) => {
  try {
    const deadlinesSnapshot = await db.collection('deadlines').get();
    const deadlines = {};
 
    deadlinesSnapshot.forEach(doc => {
      deadlines[doc.id] = doc.data().deadline;
    });
 
    res.status(200).json(deadlines);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
 };
 
