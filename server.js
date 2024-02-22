const express = require('express');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({path: './config/config.env'});

const app = express();

app.get('/api/v1/campground', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Show all campground space'
    })
})
