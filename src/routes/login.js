// Import required modules
const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Create connection pool for MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: "Z",
    connectTimeout: 10000 // 10 seconds
    // port: process.env.DB_PORT,
    // socketPath: process.env.DB_SOCKET_PATH // Ensure the correct path variable
});

// Create express app
const app = express();
const router = express.Router();

app.use(cookieParser());

// Middleware to parse JSON bodies
router.use(express.json());



module.exports = router;
