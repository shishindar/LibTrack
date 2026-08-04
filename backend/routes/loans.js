const express = require('express');
const router = express.Router();

const loanController = require('../controllers/loanController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, loanController.getAllLoans);

router.get('/overdue', requireAuth, loanController.getOverdueLoans);

router.post('/issue', requireAuth, loanController.issueBook);

router.post('/return', requireAuth, loanController.returnBook);

module.exports = router;