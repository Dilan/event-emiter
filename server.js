const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

// CLI
if (require.main === module) {

    // EventEmitter
    const mediator = new (require('events').EventEmitter)();

    mediator.on('users.create', (user) => {
        console.log(`User ${user.id} were created.`);
    });
    mediator.on('users.update', (user) => {
        console.log(`User ${user.id} were updated.`);
    });


    // mongo ===================================================================
    var uri = config.mongo.uri;

    mongoose.plugin(require('./src/plugins/mongoose.schema').init(mediator));
    mongoose.connect(uri, { useNewUrlParser: true });
    mongoose.set('useFindAndModify', false);
    mongoose.connection.on('connected', function() {
        console.log('🔋  Mongoose connection open to ' + uri);
    });

    // application =============================================================
    var app = express();

    app.set('trust proxy', 'loopback');
    var bodyParser = require('body-parser');
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(express.static('./public'));

    // logging every http request
    app.use(function(req, res, next) {
        console.log(
            req.method,
            decodeURIComponent(req.url),
            (req.method !== 'GET' ? JSON.stringify(req.body, null, 0) : '')
        );
        next();
    });

    // routes
    app.get('/', function(req, res) { res.json({ status: 'success' }); });
    app.use('/api/users', require('./src/routes/users'));

    app.use(function errorHandler (err, req, res, next) {
        if (res.headersSent)
            return next(err);
        return res.status(500).json({ error: 'Unexpected error.' });
    });

    // http server =============================================================
    var port = config.app.port;

    var server = require('http').createServer(app)
        .on('listening', function() {
            console.log(`🚀  Server listening on port ${port}`);
        })
        .on('error', function(err) {
            console.log(err);
        })
        .listen(port);

    // uncaught exceptions and rejections ======================================
    process.on('uncaughtException', function (err) {
        console.error(err);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, p) => {
      console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
      process.exit(1);
    });
}
