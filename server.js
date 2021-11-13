const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const config = require('./config');

// CLI
if (require.main === module) {

    // EventEmitter
    const mediator = new (require('events').EventEmitter)();

    const listeners = require('./src/listeners').init(mediator);
    const { careerCounselor, accountManager, onedrive } = listeners;

    mediator.on('users.create', onedrive.createAccount);
    mediator.on('users.create', accountManager.notifyOnNewUser);
    mediator.on('users.update', accountManager.notifyOnUserUpdate);
    mediator.on('users.update', careerCounselor.notifyOnChangingDepartment);

    // mongo ===================================================================
    var uri = config.mongo.uri;

    mongoose.plugin(require('./src/plugins/mongoose.schema').init(mediator));
    mongoose.connect(uri, { useNewUrlParser: true });
    mongoose.connection.on('connected', function() {
        console.log('🔋  Mongoose connection open to ' + uri);
    });

    // application =============================================================
    var app = express();

    app.set('trust proxy', 'loopback');
    // middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, './public')));

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

    // init WebSocket server
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws) => {
       ws.on('message', (message) => {
           console.log('received: %s', message);
           ws.send(`Hello, you sent -> ${message}`);
       });

       mediator.on('websocket.message', (message) => {
           ws.send(message);
       });
    });

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
