const Appointment = require("../models/Appointment");
const Campground = require("../models/Campground");
const Transaction = require("../models/Transaction");
const TransactionSlip = require("../models/TransactionSlip");
const { createPromptPayQR } = require("../utils/createPromptpayQR")

/**
 * @desc create promptpayQR with req body
 * @route POST /api/v1/transactions/promptpayqr
 * @access Private
 * @param req.body : promptpayID, appointmentID
 */
exports.createPromptpayQR = async (req, res, next) => {
  try {
    console.log(req.body);
    const data = req.body;

    if (!data.promptpayID || !data.appointmentID ) {
      const error = new Error("promptpayID or appointmentID is missing in the request body");
      error.code = 400;
      throw error;
    }

    const appointment = await Appointment.findById(data.appointmentID);

    if(!appointment) {
      const error = new Error(`No appointment with the id of ${req.params.appointmentId}`);
      error.code = 404;
      throw error;
    }

    const campground = await Campground.findById(appointment.campground);

    if (!campground) {
      const error = new Error(`No campground with the ID of ${appointment.campground}`);
      error.code = 404;
      throw error;
    }

    console.dir(campground.price, {showHidden: false, depth: null, colors: true});
    if (!campground.price) {
      const error = new Error(`campground with the ID of ${appointment.campground} does not exist price attribute`)
      error.code = 500;
      throw error
    }

    let returnData;
    await createPromptPayQR(data.promptpayID, campground.price)
    .then((data) => {
      returnData = data;
      if (returnData === 'error') {
        const error = new Error("QR code Creation Function failed");
        error.code = 500;
        throw error;
      }
    })

    res.status(200).json({
      success: true,
      data: returnData
    })
  } catch (err) {
    console.log(err);
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
}


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
      query = query.find({user : req.user.id}).populate({
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
