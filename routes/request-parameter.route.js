/*
 * Routers for request-parameter requests are defined
 */
const express = require('express');
const router = express.Router();

// request-parameter controller access
const request_parameter_controller = require('../controllers/request-parameter.conroller');

//routing path is defined with following controller function
router.post('/filteredData', request_parameter_controller.getFilteredData)
module.exports = router;