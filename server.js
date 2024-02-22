const express = require('express');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({path: './config/config.env'});

const app = express();

app.get('/api/v1/campground', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Show all campgrounds available'
    });
});

app.get('/api/v1/campground/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `Show a campground with id: ${req.params.id}`
    });
});

app.post('/api/v1/campground', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Create new campground'
    });
});

app.put('/api/v1/campground/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `Update campground with id: ${req.params.id}`
    });
});

app.delete('/api/v1/campground/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `Delete campground with id: ${req.params.id}`
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server is running in ', process.env.NODE_ENV, ' mode on port ', PORT));