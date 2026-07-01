const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth Test Working'
  });
});

router.post('/register', authController.register);
router.post('/login', authController.login);

console.log('ME ROUTE LOADED');

router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;