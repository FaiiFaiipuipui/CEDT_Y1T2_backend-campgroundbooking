const express = require("express");
const {getTransactionSlips, getTransactionSlip, addTransactionSlip} = require("../controllers/transactionslip");

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

router
    .route("/")
    .get(protect, getTransactionSlips)
    .post(protect, authorize("user"), addTransactionSlip);

router
    .route("/:id")
    .get(protect, getTransactionSlip);

module.exports = router;