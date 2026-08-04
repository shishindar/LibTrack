const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { loginLimiter } = require("../middleware/rateLimiter");

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth Test Working'
  });
});

router.post('/register', authController.register);
router.post("/login", loginLimiter, authController.login);
router.post("/refresh", authController.refreshToken);

console.log('ME ROUTE LOADED');

const db = require("../config/db");

router.get("/me", requireAuth, async (req, res) => {
  try {
    const [users] = await db.query(
  `
  SELECT
    id,
    full_name,
    email,
    profile_image
  FROM users
  WHERE id = ?
  `,
  [req.user.id]
);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: users[0],
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;