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

  query = Transaction.find(JSON.parse(queryStr));
  if (req.user.role !== "admin") {
    if(req.params.campgroundId){
      console.log(req.params.campgroundId);
      query = query.find({campground: req.params.campgroundId, user : req.user.id}).populate({
        path: "campground",
        select: "name",
      }).populate({
        path: "user",
        select: "name",
      });
    }else{
      query = query.find({user : req.user.id}).populate({
        path: "campground",
        select: "name",
      }).populate({
        path: "user",
        select: "name",
      });
  }
  } else {
    if (req.params.campgroundId) {
      console.log(req.params.campgroundId);
      query = query.find({
        campground: req.params.campgroundId,
      }).populate({
        path: "campground",
        select: "name",
      }).populate({
        path: "user",
        select: "name",
      });
    } else {
      query = query.find().populate({
        path: "campground",
        select: "name",
      }).populate({
        path: "user",
        select: "name",
      });
    }
  }

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
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

  try {
    const transactions = await query;

    // Pagination result
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
    console.log(err.stack);
    res.status(500).json({
      success: false,
      message: "Cannot find any Transaction",
    });
  }
};

// @desc:    Get a single transaction with an id
// @route:   GET /api/v1/transactions/:id
// @access:  Private
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate({
      path: "campground",
      select: "name",
    }).populate({
      path: "user",
      select: "name",
    });

    if (!transaction) {
      return res.status(404).json({ 
        success: false,
        message: `No transaction with the id of ${req.params.id}`
      });
    }

    if(transaction.user._id.toString() !== req.user.id && req.user.role !== 'admin'){
      console.log("1 : " + transaction.user.toString())
      console.log("2 : " + req.user.id)
      return res.status(401).json({
        success:false,
        message:`User ${req.user.id} is not authorized to get this transaction`
      });
    }
  
    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Cannot find Transaction"
    });
  }
};