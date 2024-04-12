const Transaction = require('../models/Transaction');

// @desc:    Get all transactions
// @route:   GET /api/v1/transactions
// @access:  Private
exports.getTransactions = async (req, res, next) => {
  let query;
  console.log(req);

  const reqQuery = {...req.query};
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over remove fields and delete from reqQuery
  removeFields.forEach((params) => delete reqQuery[params]);

  let queryStr = JSON.stringify(req.query);

  // Create operators ($gt, $gte, etc.)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Select
  query = Transaction.find(JSON.parse(queryStr));

  // Sort
  if (req.query.select) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("name");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Transaction.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (req.user.role !== "admin") {
    query = Transaction.find({ user: req.user.id }).populate({
      path: "appointment",
      select: "user campground",
    });
  } else {
    // If you are an admin, you can see all!
    if (req.params.transactionId) {
      console.log(req.params.transactionId);
      query = Transaction.find({
        campground: req.params.transactionId,
      })
    } else
      query = Transaction.find()
  }

  try {
    const transactions = await query;

    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination,
      data: transactions,
    });
    console.log('success', transactions.length);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc:    Get a single transaction with an id
// @route:   GET /api/v1/transactions/:id
// @access:  Private
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ 
        success: false,
        message: `No transaction with the id of ${req.params.id}`
      });
    }
  
    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Cannot find transaction"
    });
  }
};