const express = require("express");
const {
  getAppointments,
  getAppointment,
  addAppointment,
  updateAppointment,
} = require("../controllers/appointments");

const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getAppointments).post(addAppointment);
router.route("/:id").get(getAppointment).put(updateAppointment);

module.exports = router;
