const express = require('express');
const {getCampgrounds, getCampground, createCampground, updateCampground, deleteCampground} = require('../controllers/campgrounds');

const router = express.Router();

router.route('/').get(getCampground).post(createCampground);
router.route('/:id').get(getCampground).put(updateCampground).delete(deleteCampground);

module.exports = router;