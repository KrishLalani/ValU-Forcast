// Import required modules
const express = require('express');
const app = express();
const router = express.Router();
const sql = require('mssql');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const moment = require('moment');
const vverifyToken = require('../middlewares/middleware.js');

// Secret key for JWT (stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to parse JSON bodies
app.use(express.json());

const { verifyToken, checkRole } = vverifyToken;

// Database connection configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use encryption if the database server supports it
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

// Connect to the database
sql.connect(dbConfig, err => {
    if (err) {
        console.error('Error connecting to SQL Server:', err);
        return;
    }
    console.log('Connected to SQL Server');
});

// Middleware to ensure connection is alive for each request
app.use((req, res, next) => {
    if (sql.globalConnection && sql.globalConnection.connected) {
        return next();
    }
    sql.connect(dbConfig, err => {
        if (err) {
            console.error('Error re-connecting to SQL Server:', err);
            res.status(500).json({ status: 'error', message: 'Database connection error' });
        } else {
            next();
        }
    });
});

router.get('/validate-user/:uid', (req, res) => {
    const { uid } = req.params;

    const query = 'SELECT * FROM [user] WHERE uid = @uid';
    const request = new sql.Request();
    request.input('uid', sql.VarChar, uid);
    request.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ status: 'error', message: err.message });
            return;
        }

        if (result.recordset.length > 0) {
            res.json({
                message: 'user_exists',
                "type": result.recordset[0].type
            });
        } else {
            res.json({ message: 'please_sign_up' });
        }
    });
});

module.exports = router;
