const express = require('express');
const router = express.Router();

const loanController = require('../controllers/loanController');

router.get('/', loanController.getAllLoans);
router.get('/overdue', loanController.getOverdueLoans);

router.post('/issue', loanController.issueBook);
router.post('/return', loanController.returnBook);

module.exports = router;