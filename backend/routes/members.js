const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const memberController = require('../controllers/memberController');

router.get('/', requireAuth, memberController.getAllMembers);

router.get('/:id', requireAuth, memberController.getMemberById);

router.post('/', requireAuth, memberController.createMember);

router.put('/:id', requireAuth, memberController.updateMember);

router.delete('/:id', requireAuth, memberController.deleteMember);

module.exports = router;