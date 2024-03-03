const express = require("express");
const {
  getCampgrounds,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgrounds");

const appointmentRouter = require('./appointments');
const weatherRouter = require('./weathers');

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.use('/:campgroundId/appointments/', appointmentRouter);
router.use('/:campgroundId/weather/', weatherRouter);

router
  .route("/")
  .get(getCampgrounds)
  .post(protect, authorize("admin"), createCampground);
router
  .route("/:id")
  .get(getCampground)
  .put(protect, authorize("admin"), updateCampground)
  .delete(protect, authorize("admin"), deleteCampground);

module.exports = router;
