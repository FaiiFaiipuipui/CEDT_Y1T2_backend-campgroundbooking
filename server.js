const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Route files
const campgrounds = require('./routes/campgrounds');

// Load env variables
dotenv.config({path: './config/config.env'});

// Connect to database
connectDB();

const app = express();

// Mount routers
app.use('/api/v1/campgrounds', campgrounds);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server is running in', process.env.NODE_ENV, 'mode on port', PORT));