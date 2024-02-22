// @desc:    Get all campgrounds
// @route:   GET /api/v1/campgrounds
// @access:  Public
exports.getCampgrounds = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Show all campgrounds'
    });
};

// @desc:    Get a single campgrounds with an id
// @route:   GET /api/v1/campgrounds/:id
// @access:  Public
exports.getCampground = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Show a campground with an id: ${req.params.id}`
    });
};

// @desc:    Create a new campground
// @route:   POST /api/v1/campgrounds
// @access:  Private
exports.createCampground = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Create new campgounds'
    });
};

// @desc:    Update a campground with an id
// @route:   PUT /api/v1/campgrounds
// @access:  Private
exports.updateCampground = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Update a campground with an id: ${req.params.id}`
    });
};

// @desc:    Delete a campground with an id
// @route:   DELETE /api/v1/campgrounds/:id
// @access:  Private
exports.deleteCampground = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Delete a campground with an id: ${req.params.id}`
    });
};