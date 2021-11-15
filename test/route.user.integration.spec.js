const assert = require('assert');
const request = require('supertest');
const sinon = require('sinon');

const server = require('../server');

const mediator = server.bootstrap.mediator();
server.bootstrap.mongo(mediator);
const app = server.app();

const User = require('../src/models/User');

describe('API user integration routes tests:', function() {

    before(function(done) {

        Promise.all([
            User.create({ name: 'Anton', department: 'IT' })
        ])
        .then(function() {
            done();
        })
        .catch(err => {
            done(err);
        });
    });

    after(async () => {
        await User.deleteMany({  }); // delete all
    });

    var app;
    beforeEach(function(done) {
        app = require('../server').app();
        done();
    });

    afterEach(function(done) {
        done();
    });

    it('Request POST to /api/users trigger [users.create] event', async () => {
        
        var userCreateSpy = sinon.spy();
        mediator.on('users.create', userCreateSpy);
        
        let res = await request(app)
            .post('/api/users')
            .set('Accept', 'application/json')
            .send({
                name: 'John', department: 'DevOps'
            });

        var item = res.body;

        assert.equal(res.statusCode, 200);
        assert.equal('updated_at' in item, true);
        assert.equal(item.name, 'John');
        assert.equal(userCreateSpy.callCount, 1);
    });

    it('Request to /api/users return 2 users from DataBase', function(done) {

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
