const express = require('express');
const { getTransactions, getTransaction } = require('../controllers/transactions');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, authorize('admin'), getTransactions);

router
    .route('/:id')
    .get(protect, authorize('admin'), getTransaction);

module.exports = router;