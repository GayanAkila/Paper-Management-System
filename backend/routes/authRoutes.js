const express = require('express');
const { check } = require('express-validator');
const { register, login ,  changePassword,
  forgotPassword,} = require('../controllers/authController');
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

// Change password route (requires authentication)
router.post(
  "/change-password",
  protect,
  [
    check("currentPassword", "Current password is required").exists(),
    check("newPassword", "New password must be 6 or more characters").isLength({ min: 6 }),
  ],
  changePassword
);

// Forgot password route
router.post(
  "/forgot-password",
  [
    check("email", "Please include a valid email").isEmail(),
  ],
  forgotPassword
);

module.exports = router;
