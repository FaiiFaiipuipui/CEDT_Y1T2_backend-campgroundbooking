const Transaction = require('../models/Transaction');
const TransactionSlip = require('../models/TransactionSlip');

// @desc    Get all transactionSlips
// @route   GET /api/v1/transactionslips
// @access  Public
exports.getTransactionSlips = async (req, res, next) => {
    let query;
    //General users can see only their appointments!
    if (req.user.role !== "admin") {
      query = TransactionSlip.find({ user: req.user.id });
    } else {
      // If you are an admin, you can see all!
      if (req.params.transactionId) {
        query = TransactionSlip.find({
          payment_id: req.params.transactionId,
        });
      } else
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
  // @route   GET /api/v1/transactionslips/:transactionSlipId
  // @access  Public
  exports.getTransactionSlip = async (req, res, next) => {
    try {
      const transactionSlip = await TransactionSlip.findById(req.params.transactionSlipId);
  
      if (!transactionSlip) {
        return res.status(404).json({
          success: false,
          message: `No transaction slip with the id of ${req.params.transactionSlipId}`,
        });
      }
      res.status(200).json({ success: true, data: appointment });
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
    try{
        req.body.payment_id = req.params.transactionId;

        //check transaction
        const transaction = await Transaction.findById(req.params.transactionId);
        if(!transaction){
            return res.status(404).json({
                success: false,
                message: `Cannot find transaction with id: ${req.params.transactionId}`
            });
        }

        const transactionSlip = await TransactionSlip.create(req.body);
        res.status(201).json({
            success: true,
            data: transactionSlip
        });
    }
    catch(err){
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            message: `Cannot create a transaction slip for transactionId: ${req.params.transactionId}`
        });
    }
};