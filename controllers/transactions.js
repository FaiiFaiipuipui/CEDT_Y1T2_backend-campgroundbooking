const Appointment = require("../models/Appointment");
const Campground = require("../models/Campground");
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