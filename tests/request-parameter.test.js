const request = require('supertest');
const app = require('../app');

describe('Post Endpoint', () => {
    it('should fetch filtered records', async () => {
        const res = await request(app)
            .post('/requestParameters/filteredData')
            .send({
                startDate: "2017-01-26",
                endDate: "2018-02-02",
                minCount: 2700,
                maxCount: 3000
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('records');
    });


    it('should return with response code 400 because of missing body', async () => {
        const res = await request(app)
            .post('/requestParameters/filteredData')
            .send(null);
        expect(res.statusCode).toEqual(400);
        expect(res.body.msg).toEqual("Error validating request, no valid request parameters.");
        expect(res.body.code).toEqual(1);
    });


    it('should return with response code 400 because of invalid counts', async () => {
        const res = await request(app)
            .post('/requestParameters/filteredData')
            .send({
                startDate: "2017-01-26",
                endDate: "2018-02-02",
                minCount: 3001,
                maxCount: 3000
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.msg).toEqual('Error validating request, minCount must be less than maxCount.');
        expect(res.body.code).toEqual(1);
    });


    it('should return with response code 400 because of invalid dates', async () => {
        const res = await request(app)
            .post('/requestParameters/filteredData')
            .send({
                startDate: "2018-01-01",
                endDate: "2017-01-01",
                minCount: 3000,
                maxCount: 3001
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.msg).toEqual('Error validating request, startDate must be before endDate.');
        expect(res.body.code).toEqual(1);
    });


    it('should return with response code 400 because of invalid parameters', async () => {
        const res = await request(app)
            .post('/requestParameters/filteredData')
            .send({
                invalidParameter: ""
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.msg).toEqual("Error validating request, no valid request parameters.");
        expect(res.body.code).toEqual(1);
    });


    it('should return with response code 400 because of invalid date', async () => {
        const res = await request(app)
            .post('/requestParameters/filteredData')
            .send({
                startDate: "20180101",
                endDate: "20170101",
                minCount: 1000,
                maxCount: 2000
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.msg).toEqual("Error validating request, startDate and endDate must be in YYYY-MM-DD format.");
        expect(res.body.code).toEqual(1);
    });
});
