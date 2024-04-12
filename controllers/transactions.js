const Transaction = require('../models/Transaction');

// @desc:    Get all transactions
// @route:   GET /api/v1/transactions
// @access:  Private
exports.getTransactions = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    } else {
        try {
            const transactions = await Transaction.find();

            return res.status(200).json({
                success: true,
                count: transactions.length,
                data: transactions
            });
        } catch (err) {
            console.log(err.stack);
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            });
        }
    }
};

// @desc:    Get a single transaction with an id
// @route:   GET /api/v1/transactions/:id
// @access:  Private
exports.getTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
    
        if (!transaction) {
          return res.status(400).json({ success: false });
        }
    
        res.status(200).json({
          success: true,
          data: transaction,
        });
      } catch (err) {
        res.status(400).json({
          success: false,
          error: err.message,
        });
      }
};