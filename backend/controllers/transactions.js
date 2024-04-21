const Appointment = require("../models/Appointment");
const Campground = require("../models/Campground");
const Transaction = require("../models/Transaction");
const TransactionSlip = require("../models/TransactionSlip");
const { createPromptPayQR } = require("../utils/createPromptpayQR");

/**
 * @desc create promptpayQR with req body
 * @route POST /api/v1/transactions/promptpayqr
 * @access Private
 * @param req.body : transactionId
 */
exports.createPromptpayQR = async (req, res, next) => {
  try {
    console.log(req.body);
    const data = req.body;

    if (!data.transactionId) {
      const error = new Error("transactionId is missing in the request body");
      error.code = 400;
      throw error;
    }

    const transaction = await Transaction.findById(data.transactionId).populate(
      {
        path: "campground",
        select: "name price promptpayTel",
      }
    );

    if (!transaction) {
      const error = new Error(
        `No transaction with the id of ${data.appointmentID}`
      );
      error.code = 404;
      throw error;
    }

    console.log(transaction);
    console.log(transaction.campground);
    console.log(transaction.campground.price.toString());
    campgroundPrice = parseFloat(transaction.campground.price.toString());

    if (!campgroundPrice) {
      const error = new Error(
        `campground with the ID of ${transaction.campground} does not exist price attribute`
      );
      error.code = 500;
      throw error;
    }

    let returnData;
    await createPromptPayQR(
      transaction.campground.promptpayTel,
      campgroundPrice
    ).then((data) => {
      returnData = data;
      if (returnData === "error") {
        const error = new Error("QR code Creation Function failed");
        error.code = 500;
        throw error;
      }
    });

    res.status(200).json({
      success: true,
      data: returnData,
      campgroundPrice: transaction.campground.price.toString(),
    });
  } catch (err) {
    console.log(err);
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc:    Get all transactions
// @route:   GET /api/v1/transactions
// @access:  Private
exports.getTransactions = async (req, res, next) => {
  let query;
  console.log(req);

  const reqQuery = { ...req.query };
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
    query = query
      .find({ user: req.user.id })
      .populate({
        path: "campground",
        select: "name price",
      })
      .populate({
        path: "user",
        select: "name",
      });
  } else {
    query = query
      .find()
      .populate({
        path: "campground",
        select: "name price",
      })
      .populate({
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
  const limit = parseInt(req.query.limit, 10) || 100;
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
    console.log("success", transactions.length);
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
    const transaction = await Transaction.findById(req.params.id)
      .populate({
        path: "campground",
        select: "name price",
      })
      .populate({
        path: "user",
        select: "name",
      });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `No transaction with the id of ${req.params.id}`,
      });
    }

    // if (
    //   transaction.user._id.toString() !== req.user.id &&
    //   req.user.role !== "admin"
    // ) {
    //   return res.status(401).json({
    //     success: false,
    //     message: `User ${req.user.id} is not authorized to get this transaction`,
    //   });
    // }

    res.status(200).json({
      success: true,
      data: transaction,
      campgroundPrice: transaction.campground.price.toString(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Cannot find Transaction",
    });
  }
};

// @desc: Post the e-receipt
// @route: POST /api/v1/transactions/:appointmentId
// @access: Private
exports.addTransaction = async (req, res, next) => {
  try {
    req.body.appointment = req.params.appointmentId;
    req.body.status = "PENDING";
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.appointmentId}`,
      });
    }

    // Add user Id to req body
    req.body.user = req.user.id;

    //Add campground Id to req body
    const campground = await Campground.findById(appointment.campground);

    if (!campground) {
      return res.status(404).json({
        success: false,
        message: `No campground with the id of ${req.params.appointmentId}`,
      });
    }

    req.body.campground = campground._id;

    req.body.rent_date = appointment.apptDate;

    const transaction = await Transaction.create(req.body);

    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot make transaction" });
  }
};

// @desc    Update transaction
// @route   PUT /api/v1/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

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

    //ADMIN : Admin can update when transaction was PENDING after user upload slip

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
        message: `Cannot update transaction with the id of ${req.params.id}'s status is not a valid format, [New Status: ${req.body.status}]`,
      });
    }

    //Update value of transaction [Admin: update status]
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
      transaction.set({
        successful_payment_date: transactionSlip.submit_time,
        successful_payment_slip_image: transactionSlipId,
      });
      transaction = await transaction.save();
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
