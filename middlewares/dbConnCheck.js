const mongodb = require('./../dbConn');

async function checkMongoConn(req, resp, next) {
    console.log('Verifying Mongo Connection...');
    try{
        req.db = await mongodb.connect(); //Checking for Mongo connection and adding the db object to request object
        next();
    }
    catch(error){
        console.log('Error fetching Mongo connection...\n', error);
    }
}

module.exports = checkMongoConn;