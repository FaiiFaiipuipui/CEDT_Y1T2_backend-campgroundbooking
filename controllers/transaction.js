const Transaction = require("../models/Transaction");

// @desc    Update transaction [slip]
// @route   PUT /api/v1/transactions/:transactionId
// @access  Private
exports.updateTransaction = async (req, res, next) => {
    try {

        let transaction = await Transaction.findById(req.params.transactionId);

        //check transaction
        if(!transaction){
          return res.status(404).json({
            success: false,
            message: `No transaction with the id of ${req.params.transactionId}`,
          });
        }

      /*
        Status : [PENDING, COMPLETE, REJECTED, CANCELED]
        User can update when transaction was rejected by admin
        Admin can update when transaction was pending after user upload slip
      */

      // Make sure user is the transaction owner
        if(transaction.user.toString() !== req.user.id && req.user.role !== "admin"){
          return res.status(401).json({
            success: false,
            message: `User ${req.user.id} is not authorized to update this transaction`,
          });
        }
        else {
          if(transaction.status !== 'REJECTED'){
            return res.status(401).json({
              success: false,
              message: `Cannot update transaction with the id of ${req.params.transactionId}`,
            });
          }
        }

      transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
  
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