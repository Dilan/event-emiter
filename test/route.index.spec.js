const assert = require('assert');
const request = require('supertest');

describe('API routes tests:', function() {

    var app;
    beforeEach(function(done) {
        app = require('../server').app();
        done();
    });

    afterEach(function(done) {
        done();
    });

    it('Request to / return 200 response', function(done) {
        request(app)
            .get('/api')
            .end(function(err, res) {
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.status, 'success');
                done();
            });
    });

});
