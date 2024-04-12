const Transaction = require('../models/Transaction');

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

exports.getTransaction = async (req, res, next) => {
    
};