const Appointment = require('../models/Appointment');

// @desc:    Get all appointments
// @route:   GET api/v1/appointments
// @access:  Private
exports.getAppointments = async (req, res, next) => {
    
    let query;

    // General users can see only their appointment
    if (req.user.role !== 'admin') {
        query = Appointment.find({user: req.user.id});
    }
    else {
        if (req.params.campgroundId) {
            console.log(req.params.campgroundId);
            query = Appointment.find({campground: req.params.campgroundId});
        }
        else {
            query = Appointment.find();
        }
    }

    try {
        const appointments = await query;
        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot find Appointment"
        });
    }
};