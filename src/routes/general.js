// Import required modules
const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();
// Middleware to parse JSON bodies
app.use(express.json());


// Database connection
const connection = mysql.createConnection({
    port:process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id', connection.threadId);
});


router.get('/validate-user/:uid', (req, res) => {
    const { uid } = req.params;
  
    const query = 'SELECT * FROM user WHERE uid = ?';
    connection.query(query, [uid], (err, results) => {
      if (err) {
        res.status(500).json({ status: 'error', message: err.message });
        return;
      }
  
      if (results.length > 0) {
        res.status(200).json({ message: 'user_exists',
            "type" : results[0].type
         });
      } else {
        res.status(200).json({ message: 'please_sign_up',
         });
      }
    });
});
router.get('/users', (req, res) => {
  const query = 'SELECT * FROM user';
  
  connection.query(query, (err, results) => {
      if (err) {
          res.status(500).json({ status: 'error', message: err.message });
          return;
      }

      res.status(200).json({ status: 'success', data: results });
  });
});

module.exports = router;
