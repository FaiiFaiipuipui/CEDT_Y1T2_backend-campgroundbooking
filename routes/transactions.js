const express = require('express');
const { createPromptpayQR,
    getTransactions, 
    getTransaction  
} = require('../controllers/transactions');
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route('/promptpayqr')
  .post(protect, authorize("admin", "user"), createPromptpayQR);

router
    .route('/')
    .get(protect, authorize("admin", "user"), getTransactions);

router
    .route('/:id')
    .get(protect, authorize("admin", "user"), getTransaction);

module.exports = router;const express = require("express");
const {updateTransaction} = require("../controllers/transactions");

const transactionSlipRouter = require("./transactionslips");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.use('/:transactionId/transactionslips/', transactionSlipRouter);

router.route("/:id")
    .put(protect, authorize("admin","user"), updateTransaction);

module.exports = router;