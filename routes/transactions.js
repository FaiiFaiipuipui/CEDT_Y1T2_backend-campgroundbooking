const express = require('express');

const { addTransaction } = require('../controllers/transactions')

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .post(protect, authorize('admin', 'user'), addTransaction);

module.exports = router;