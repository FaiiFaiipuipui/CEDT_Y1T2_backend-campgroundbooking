const Transaction = require('../models/Transaction');
const TransactionSlip = require('../models/TransactionSlip');

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