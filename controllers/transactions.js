const Transaction = require("../models/Transaction");
const Appointment = require("../models/Appointment");
const TransactionSlip = require("../models/TransactionSlip");

// @desc: Post the e-receipt
// @route: POST /api/v1/transactions/:appointmentId
// @access: Private
exports.addTransaction = async (req, res, next) => {
  try {
    req.body.appointment = req.params.appointmentId;

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
    const campground = appointment.campground;

    if (!campground) {
      return res.status(404).json({
        success: false,
        message: `No campground with the id of ${req.params.appointmentId}`,
      });
    }

    req.body.campground = campground;

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
