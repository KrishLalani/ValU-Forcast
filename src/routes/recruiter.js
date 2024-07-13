const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const vverifyToken = require("../middlewares/middleware.js");
const moment = require("moment");
const nodemailer = require('nodemailer');


require("dotenv").config();

const router = express.Router();

const secret = process.env.JWT_SECRET || "yourSecretKey";

const { verifyToken, checkRole } = vverifyToken;

router.use(express.json());
router.use(cookieParser());

const connection = mysql.createConnection({
  port:process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: "Z",
  connectTimeout: 10000 // 10 seconds
  // socketPath: process.env.DB_SOCKET_PATH,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as id", connection.threadId);
});


/// to insert data into recruiter table with details
router.post("/registerRecruiterProfileDetails/:uid",(req, res) => {
  const { recruiter_name, shop_name, work_time, aboutShop, address, city, state } = req.body;
  const { uid } = req.params; // Extracting uid from request params

  if (!recruiter_name || !shop_name || !work_time || !aboutShop || !address || !city || !state) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = `
    INSERT INTO recruiter (uid, recruiter_name, shop_name, work_time, aboutShop, address, city, state)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [uid, recruiter_name, shop_name, work_time, aboutShop, address, city, state];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
    res.status(201).json({ message: "Recruiter profile created successfully." });
  });
});


module.exports = router;

