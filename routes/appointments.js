const express = require("express");
const {
  getAppointments,
  getAppointment,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointments");

//Require transaction router
const transactionRouter = require('./transactions');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

//Use transaction router
router.use('/:appointmentId/transactions', transactionRouter);

router
  .route("/")
  .get(protect, getAppointments)
  .post(protect, authorize("admin", "user"), addAppointment);

router
  .route("/:id")
  .get(protect, getAppointment)
  .put(protect, authorize("admin", "user"), updateAppointment)
  .delete(protect, authorize("admin", "user"), deleteAppointment);

module.exports = router;
