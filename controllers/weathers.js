const Campground = require('../models/Campground');

// @desc Get weathers of campground with an ID of campgroundId
// @route: GET /api/v1/campgrounds/:campgroundId/weather/
// @access: Public
exports.getWeather = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.campgroundId);
    console.log(req.params.campgroundId);

    if (!campground) {
      return res.status(400).json({
        success: false,
        message: 'Cannot find campground with the provided ID'
      })
    }

    const campgroundObj = campground.toObject();
    let rawCoordinate = campgroundObj.coordinate; /* coordinate is spelled right, spellchecker is probably drunk or sth */

    rawCoordinate = rawCoordinate.split(" ");
    let latitude = rawCoordinate.at(0);
    let longtitude = rawCoordinate.at(1);

    res.status(200).json({
      success: true
    });
  } catch(err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather Information'
    })
  }
}