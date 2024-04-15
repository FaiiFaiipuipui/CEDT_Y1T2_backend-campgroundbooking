const express = require('express');

const { addTransaction } = require('../controllers/transactions')

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router
    .route('/:appointmentId')
    .post(protect, authorize('admin', 'user'), addTransaction);

module.exports = router;