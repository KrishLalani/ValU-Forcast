// const dotenv = require('dotenv');
// const app = require('./app.js');

// dotenv.config({
//     path: './.env'
// });

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const dotenv = require('dotenv');
const app = require('./app'); // Ensure app.js is in the same directory

dotenv.config({
    path: './.env' // Ensure the .env file is in the root directory
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
