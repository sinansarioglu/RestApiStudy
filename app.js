/*
 * Main application file.
 */

const express = require('express');
const bodyParser = require('body-parser');

// initialize application
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//create router for request-parameter
const request_parameter = require('./routes/request-parameter.route');
app.use('/requestParameters', request_parameter);

let port = 1234;
app.listen(port, () => {

});

module.exports = app;