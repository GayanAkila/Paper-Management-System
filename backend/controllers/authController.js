const { auth, db } = require("../firebase/firebaseConfig");
const { validationResult } = require("express-validator");
const sendEmail = require('../utils/emailService');
const axios = require("axios");

// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await auth.setCustomUserClaims(userRecord.uid, {
      role: role || "student",
      isActive: true,
    });

    await db
      .collection("users")
      .doc(userRecord.uid)
      .set({
        name,
        email,
        role: role || "student",
        isActive: true,
      });

      const message = `Welcome to BISSS 2024, ${name}! You have successfully registered as a ${role || "student"}.
      your email is ${email}. password is ${password}.`;
      
        await sendEmail({
          email,
          subject: 'Welcome to BISSS 2024',
          message,
        });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const apiKey = process.env.FIREBASE_API_KEY;

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });

    const { idToken, refreshToken, expiresIn, localId } = response.data;

    const userDoc = await db.collection("users").doc(localId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    res.status(200).json({
      idToken,
      refreshToken,
      expiresIn,
      user: {
        uid: localId,
        ...userData,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);

    let errorMessage = "Authentication failed";
    if (error.response?.data?.error?.message) {
      switch (error.response.data.error.message) {
        case "EMAIL_NOT_FOUND":
          errorMessage = "Email not found";
          break;
        case "INVALID_PASSWORD":
          errorMessage = "Invalid password";
          break;
        case "USER_DISABLED":
          errorMessage = "User account is disabled";
          break;
        default:
          errorMessage = "Authentication failed";
      }
    }

    res.status(401).json({ message: errorMessage });
  }
};
