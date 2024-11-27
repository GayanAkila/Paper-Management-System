const { admin } = require('../firebase/firebaseConfig');

exports.protect = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken.isActive) {
      return res.status(403).json({ message: 'User account is deactivated' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
