const express = require('express');
const { createPromptpayQR } = require('../controllers/transactions');
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route('/promptpayqr')
  .post(/* protect, authorize("admin", "user"), */ createPromptpayQR);

module.exports = router;