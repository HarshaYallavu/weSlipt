const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config({path: 'config.env'});

function connect() {
    let mongoURI = process.env.DATABASE_URI;
    let mongoPassword = process.env.PASSWORD;
    mongoURI = mongoURI.replace('<password>', mongoPassword);
    console.log(`Connecting to MongoDB for URL: ${mongoURI}`);
    mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
 
        // Handle specific error conditions
        if (error.name === 'MongoNetworkError') {
            console.error('Network error occurred. Check your MongoDB server.');
        } else if (error.name === 'MongooseServerSelectionError') {
            console.error('Server selection error. Ensure'
                + ' MongoDB is running and accessible.');
        } else {
            // Handle other types of errors
            console.error('An unexpected error occurred:', error);
        }
    });

}

module.exports = connect();