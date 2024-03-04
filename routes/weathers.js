const express = require('express');
const { getWeather, getPollution } = require('../controllers/weathers')

const router = express.Router({ mergeParams: true});

router
.route('/general')
.get(getWeather);

router
.route('/pollution')
.get(getPollution);

router
  .route('/')
  .get((req, res, next) => {
    res.status(404).json({
      success: false,
      message: 'oops! you did not specify whether to get /general or /pollution'
    })
  });

module.exports = router;