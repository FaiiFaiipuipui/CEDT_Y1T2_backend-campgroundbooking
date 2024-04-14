const express = require("express");
const {updateTransaction} = require("../controllers/transactions");

const transactionSlipRouter = require("./transactionslips");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.use('/:transactionId/transactionslips/', transactionSlipRouter);

router.route("/:id")
    .put(protect, authorize("admin","user"), updateTransaction);

module.exports = router;