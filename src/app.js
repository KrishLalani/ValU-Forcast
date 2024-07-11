// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// require('dotenv').config();

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
// app.use(cookieParser());
// app.use(cors()); // Enable CORS for all routes

// // Importing routes
// const loginRoute = require('./routes/login.js');
// const generalRoute = require('./routes/general.js');
// const seakerRoute = require('./routes/seeker.js');
// const recruiterRoute = require('./routes/recruiter.js');

// // Declaring routes
// app.use("/api", loginRoute);
// app.use("/api/general", generalRoute);
// app.use("/api/seaker", seakerRoute);
// app.use("/api/recruiter", recruiterRoute);


// module.exports = app;


const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors()); // Enable CORS for all routes

// Importing routes
const loginRoute = require('./routes/login');
const generalRoute = require('./routes/general');
const seekerRoute = require('./routes/seeker'); // Corrected 'seaker' to 'seeker'
const recruiterRoute = require('./routes/recruiter');

// Declaring routes
app.use("/api", loginRoute);
app.use("/api/general", generalRoute);
app.use("/api/seeker", seekerRoute); // Corrected 'seaker' to 'seeker'
app.use("/api/recruiter", recruiterRoute);

module.exports = app;
