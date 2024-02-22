const express = require('express');
const router = express.Router();

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Show all campgrounds available'
    });
});

app.get('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `Show a campground with id: ${req.params.id}`
    });
});

app.post('/', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Create new campground'
    });
});

app.put('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `Update campground with id: ${req.params.id}`
    });
});

app.delete('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `Delete campground with id: ${req.params.id}`
    });
});

module.exports = router;