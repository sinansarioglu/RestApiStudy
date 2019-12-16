/*
 * Data request methods for request-parameter are defined
 */

// Create client as a connection bridge
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

const dateRegex = new RegExp("[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])");
const url = 'mongodb://dbUser:dbPassword1@ds249623.mlab.com:49623/getir-case-study'

// Checks request parameters are valid or not
const validateRequest = request => {
    let error = "";

    let reqParams = request.body;
    if (!reqParams.startDate || !reqParams.endDate || !reqParams.maxCount || !reqParams.minCount) {
        error = "Error validating request, no valid request parameters."
    } else if (reqParams.maxCount <= reqParams.minCount) {
        error = "Error validating request, minCount must be less than maxCount.";
    } else if (!dateRegex.test(reqParams.startDate) || !dateRegex.test(reqParams.endDate)) {
        error = "Error validating request, startDate and endDate must be in YYYY-MM-DD format.";
    } else if (new Date(reqParams.startDate) >= new Date(reqParams.endDate)) {
        error = "Error validating request, startDate must be before endDate.";
    }
    return error;
};

// Fetches filtered data as an array
exports.getFilteredData = function (req, res) {
    let resultArray = [];
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db();
        // Validate request parameters
        let error = validateRequest(req);
        if (error) {
            res.statusCode = 400;
            let response = {
                code: 1,
                msg: error
            };
            return res.json(response);
        }
        // Filtering of records data
        let cursor = db.collection('records').aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(req.body.startDate),
                        $lt: new Date(req.body.endDate)
                    }
                }
            }, {
                $project: {
                    _id: "$id",
                    key: "$key",
                    createdAt: "$createdAt",
                    totalCount: {$sum: "$counts"},
                }
            }
            , {
                $match: {
                    totalCount: {
                        $gt: req.body.minCount,
                        $lt: req.body.maxCount
                    }
                }
            }

        ]);

        // Filling response array
        cursor.forEach(function (doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function () {
            client.close();
            let response = {
                code: 0,
                msg: "Success", records: resultArray
            };
            return res.json(response);
        })
    });
};