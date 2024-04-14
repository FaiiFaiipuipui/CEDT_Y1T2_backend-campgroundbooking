const Transaction = require("../models/Transaction");
const TransactionSlip = require("../models/TransactionSlip");

// @desc    Update transaction
// @route   PUT /api/v1/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    //console.log(req.params.id);
    //check transaction
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `No transaction with the id of ${req.params.id}`,
      });
    }

    //Status : [PENDING, COMPLETE, REJECTED, CANCELED]

    //check status transaction is not COMPLETE and CANCELED
    if (
      transaction.status === "COMPLETE" ||
      transaction.status === "CANCELED"
    ) {
      return res.status(404).json({
        success: false,
        message: `Transaction with the id of ${req.params.id}'s status is not available to update [Transaction's Status: ${transaction.status}]`,
      });
    }

    //Check User or Admin

    if (req.user.role === "admin") {
      //ADMIN CASE: Admin can update when transaction was PENDING after user upload slip

      //Check status of transaction
      if (transaction.status !== "PENDING") {
        return res.status(404).json({
          success: false,
          message: `Transaction with the id of ${req.params.id}'s status is not available to check, User doesn't update a transaction slip [Status: REJECTED]`,
        });
      }

      /* Check Status that will be updated */
      if (
        req.body.status !== "PENDING" &&
        req.body.status !== "COMPLETE" &&
        req.body.status !== "REJECTED" &&
        req.body.status !== "CANCELED"
      ) {
        return res.status(401).json({
          success: false,
          message: `Cannot update transaction with the id of ${req.params.id}'s status is not invalid, [Status: ${transaction.status}]`,
        });
      }

    } else if (req.user.role === "user") {
      //USER CASE: When admin rejected transaction, USER will see transaction's status: PENDING

      //Make sure user is the transaction owner
      if (transaction.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: `User ${req.user.id} is not authorized to update this transaction`,
        });
      }

      //Check status of transaction
      if (transaction.status !== "REJECTED") {
        return res.status(401).json({
          success: false,
          message: `Cannot update transaction with the id of ${req.params.id}'s status is not available to upload new slip, Waiting for admin check transaction slip [Status: PENDING]`,
        });
      }
    }

    //Update value of transaction [Admin: update status, User: update slip]
    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (transaction.status === "COMPLETE") {
      const transactionSlipId =
        transaction.submitted_slip_images[
          transaction.submitted_slip_images.length - 1
        ];
      const transactionSlip = await TransactionSlip.findById(transactionSlipId);
      transaction.findByIdAndUpdate(req.params.id, {
        successful_payment_date: transactionSlip.submit_time,
        successful_payment_slip_image: transactionSlipId,
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update transaction" });
  }
};
