const Transaction = require("../models/Transaction");
const TransactionSlip = require("../models/TransactionSlip");

// @desc    Get all transactionSlips
// @route   GET /api/v1/transactionslips
// @access  Private
exports.getTransactionSlips = async (req, res, next) => {
  let query;

  // Admin can see all
  if (req.params.transactionId) {
    query = TransactionSlip.find({
      payment_id: req.params.transactionId,
    });
  } else {
    query = TransactionSlip.find();
  }

  try {
    const transactionslips = await query;
    res.status(200).json({
      success: true,
      count: transactionslips.length,
      data: transactionslips,
    });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Transaction Slips" });
  }
};

// @desc    Get single transactionSlip
// @route   GET /api/v1/transactionslips/:id
// @access  Private
exports.getTransactionSlip = async (req, res, next) => {
  try {
    const transactionSlip = await TransactionSlip.findById(req.params.id);

    if (!transactionSlip) {
      return res.status(404).json({
        success: false,
        message: `No transaction slip with the id of ${req.params.id}`,
      });
    }

    const transaction = await Transaction.findById(transactionSlip.payment_id);
    console.log("Transaction User id: " + transaction.user.toString());
    console.log("Request User id: " + req.user._id);

    //Check transaction slip owner
    if (
      transaction.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to get this transaction`,
      });
    }
    res.status(200).json({ success: true, data: transactionSlip });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Transaction Slip" });
  }
};

// @desc    Add transactionSlip
// @route   POST /api/v1/transactions/:transactionId/transactionslips/
// @access  Private
exports.addTransactionSlip = async (req, res, next) => {
  try {
    req.body.payment_id = req.params.transactionId;

    //check transaction
    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Cannot find transaction with id: ${req.params.transactionId}`,
      });
    }

    const slips = transaction.submitted_slip_images.length;
    const status = transaction.status;

    //slips = 0 : can create
    //slips > 0 : can create, if transaction's status is REJECTED
    if (slips > 0 && status !== "REJECTED") {
      return res.status(400).json({
        success: false,
        message: `Cannot create a transaction slip for transactionId: ${req.params.transactionId}, waiting admin checking a transaction slip before`,
      });
    }

    const transactionSlip = await TransactionSlip.create(req.body);

    //after created slip, add slip to transaction
    transaction.submitted_slip_images.push(transactionSlip._id);
    transaction.status = "PENDING";
    await transaction.save();

    res.status(201).json({
      success: true,
      data: transactionSlip,
    });
  } catch (err) {
    console.error(err.stack);
    return res.status(500).json({
      success: false,
      message: `Cannot create a transaction slip for transactionId`
    });
  }
};
