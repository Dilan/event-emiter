const assert = require('assert');
const request = require('supertest');
const sinon = require('sinon');

const User = require('../src/models/User');

describe('API user unit routes tests:', function() {
    var stubList;
    var sandbox;

    before(function(done) {
        // mock authentication
        sinon.stub(User, 'findOne').returns(Promise.resolve({ email: 'test@dilan.app' }))
        done()
    });

    after(function(done) {
        sinon.restore();
        done()
    });

    var app;
    beforeEach(function(done) {
        app = require('../server').app();
        done();
    });

    afterEach(function(done) {
        done();
    });

    it('Request to /api/users return all users', function(done) {

        userFindAllStub = sinon.stub(User, 'getList').returns(Promise.resolve([
            { id: 1, name: 'Anton', department: 'IT' }, 
            { id: 2, name: 'John',  department: 'Devops' }
        ]))

        request(app)
            .get('/api/users')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                assert.equal(res.statusCode, 200);

                assert.equal(Array.isArray(res.body), true);
                assert.equal(res.body.length, 2);
                done();
            });
    });
});
