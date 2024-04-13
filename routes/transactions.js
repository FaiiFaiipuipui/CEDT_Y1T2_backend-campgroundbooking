const express = require('express');
const { 
    getTransactions, 
    getTransaction 
} = require('../controllers/transactions');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, getTransactions);

router
    .route('/:id')
    .get(protect, getTransaction);

module.exports = router;