// Import required modules
const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Middleware to parse JSON bodies
app.use(express.json());


// Database connection
const connection = mysql.createConnection({
  port: process.env.DB_PORT,
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
      res.status(200).json({
        message: 'user_exists',
        "type": results[0].type
      });
    } else {
      res.status(200).json({
        message: 'please_sign_up',
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


router.post('/register', async (req, res) => {
  const { uid, username, user_mail, password, type, profile_img } = req.body;
  console.log(req.body);
  if (!uid || !username || !user_mail || !password || !type || !profile_img) {
    res.status(400).json({ status: 'error', message: 'All fields are required' });
    return;
}


  try {
    // Check if the user already exists
    const query = 'SELECT * FROM user WHERE user_mail = ?';
    connection.query(query, [user_mail], async (err, results) => {
      if (err) {
        res.status(500).json({ status: 'error', message: err.message });
        return;
      }

      if (results.length > 0) {
        res.status(400).json({ msg: 'User already exists' });
        return;
      }
      console.log(req.body);
      // password genrator

      // Insert the new user into the database
      const insertQuery = 'INSERT INTO user (uid, username, user_mail, password, type, profile_img, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      connection.query(insertQuery, [uid, username, user_mail, password, type, profile_img, '2024-07-12', '2024-07-12'], (err, results) => {
        if (err) {
          res.status(500).json({ status: 'error', message: err.message });
          return;
        }

       

        const userQuery = 'SELECT uid, username, user_mail,type,profile_img FROM user WHERE uid = ?';
        connection.query(userQuery, [results.insertId], (err, userResult) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }

            // Create and return a JWT token
            const payload = {
                user: {
                    id: userResult[0].id,
                },
            };
            jwt.sign(
                payload,
                'yourSecretKey', // Replace with your own secret key
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) {
                        return res.status(500).json({ status: 'error', message: err.message });
                    }
                    console.log(userResult);
                    res.json({
                        token,
                        username: userResult[0].username,
                        user_mail: userResult[0].user_mail,
                        type: userResult[0].type,
                        profile_img: userResult[0].profile_img,
                    });
                }
            );
        });


        // Here END
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
