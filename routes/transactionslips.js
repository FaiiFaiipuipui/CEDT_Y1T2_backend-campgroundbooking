const express = require("express");
const {
    getTransactionSlips,
    getTransactionSlip,
    addTransactionSlip,
} = require("../controllers/transactionslips");

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, authorize("admin"), getTransactionSlips).post(protect, authorize("user"), addTransactionSlip);

router.route("/:id").get(protect, authorize("admin", "user"), getTransactionSlip);

module.exports = router;
