// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express application
const app = express();

// Load environment variables
require('dotenv/config');

// Middleware setup
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Set API URL and import routes
const api = process.env.API_URL;
const employeeRoute = require('./routes/employee');
const cafeRoute = require('./routes/cafe');

// Define API routes
app.use(`${api}/employee`, employeeRoute);
app.use(`${api}/cafe`, cafeRoute);

// Database configuration
const dbConfig = require('./config/database.config.js');

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {})
    .then(() => console.log("Successfully connected to the database"))
    .catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });

// Start server
app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});
