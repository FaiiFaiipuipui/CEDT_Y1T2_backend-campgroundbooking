const transaction = require('../models/Transaction');
const transactionSlip = require('../models/TransactionSlip');

// @desc    Update appointment
// @route   PUT /api/v1/transactions/:transactionId/transactionslips/
// @access  Private
exports.createTransactionSlip = async (req, res, next) => {
    try{
        const transactionSlip = await transactionSlip.create(req.body);
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