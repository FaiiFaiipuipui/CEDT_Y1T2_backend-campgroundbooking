const Transaction = require('../models/Transaction')
const Appointment = require("../models/Appointment");
const Campground = require("../models/Campground");

// @desc: Post the e-receipt
// @route: POST /api/v1/campgrounds/:campgroundId/appointments/:appointmentId/transactions
// @access: Private
exports.addTransaction = async (req, res, next) => {
   try {
    req.body.campground = req.params.campgroundId;

    const campground = await Campground.findbyId(req.params.campgroundId);

    if (!campground) {
      return res.status(404).json({
        success: false,
        message: `No campground with the id of ${req.params.campgroundId}`,
      });
    }

    req.body.appointment = req.params.appointmentId;

    const appointment = await Appointment.findbyId(req.params.appointmentId);

    if(!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.appointmentId}`,
      });
    }

    // Add user Id to req body
    req.body.user = req.user.id;

    const transaction = await Transaction.create(req.body);
    res.status(200).json({success: true, data: transaction});
   } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create transaction" });
   }
};
