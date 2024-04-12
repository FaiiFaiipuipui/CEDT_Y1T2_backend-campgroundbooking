const express = require('express');
const { getTransactions, getTransaction, addTransaction, updateTransaction, deleteTransaction } = require('../controllers/transactions');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, getTransactions)
    .post(protect, authorize('admin'), addTransaction);

router
    .route('/:id')
    .get(protect, getTransaction)
    .put(protect, authorize('admin'), updateTransaction)
    .delete(protect, authorize('admin'), deleteTransaction);