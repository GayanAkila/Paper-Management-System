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


// @route   POST /api/v1/auth/change-password
// @desc    Change password for logged in user
// @access  Private
exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;
  const uid = req.user.uid; // From auth middleware

  try {
    // First verify the current password by attempting to sign in
    const apiKey = process.env.FIREBASE_API_KEY;
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    // Get user email from database
    const userDoc = await db.collection("users").doc(uid).get();
    const userEmail = userDoc.data().email;

    // Verify current password
    try {
      await axios.post(signInUrl, {
        email: userEmail,
        password: currentPassword,
        returnSecureToken: true,
      });
    } catch (error) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    await auth.updateUser(uid, {
      password: newPassword,
    });

    // Send email notification
    const message = `Your password has been successfully changed. If you did not initiate this change, please contact support immediately.`;
    
    await sendEmail({
      email: userEmail,
      subject: 'Password Changed Successfully',
      message,
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ 
      message: "Failed to change password",
      error: error.message 
    });
  }
};


// @route   POST /api/v1/auth/forgot-password
// @desc    Send password reset email
// @access  Public
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Generate password reset link
    const apiKey = process.env.FIREBASE_API_KEY;
    const resetUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`;

    await axios.post(resetUrl, {
      requestType: "PASSWORD_RESET",
      email: email,
    });

    // Send custom email using your email service
    const message = `A password reset link has been sent to your email. Please check your inbox and follow the instructions to reset your password.`;
    
    await sendEmail({
      email,
      subject: 'Password Reset Request',
      message,
    });

    res.status(200).json({ 
      message: "Password reset email sent successfully" 
    });
  } catch (error) {
    console.error("Error initiating password reset:", error);
    
    // Handle specific Firebase Auth errors
    if (error.response?.data?.error?.message === "EMAIL_NOT_FOUND") {
      return res.status(404).json({ 
        message: "No account found with this email address" 
      });
    }

    res.status(500).json({ 
      message: "Failed to initiate password reset",
      error: error.message 
    });
  }
};
