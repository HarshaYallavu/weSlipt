//Installed Packages
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

//User defined Packages
require('./dbConn')

//Middlewares
// const mongoConnVerifier = require('./middlewares/dbConnCheck');

//Controllers
const group = require('./routes/groupRouter');

//configs
dotenv.config({path:'config.env'});

const app = express();

//app.use(mongoConnVerifier); //Middleware meant to verify mongo connection before every request and add the db object to req.

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(`${process.env.API_VERSION}/group`, group);

app.listen(port = process.env.PORT, async ()=>{
    console.log('Starting the application...');
})