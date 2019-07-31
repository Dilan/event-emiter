const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const WebSocket = require('ws');

const bootstrap = {
    mediator: function() {
        return new (require('events').EventEmitter)();
    },
    initAllEventListeners: function(mediator) {
        require('./src/events').initAll(mediator);
    },
    mongo: function(mediator) {
        var uri = config.mongo.uri;

        mongoose.plugin(require('./src/plugins/mongoose.schema').init(mediator));
        mongoose.connect(uri, { useNewUrlParser: true });
        mongoose.set('useFindAndModify', false);
        mongoose.connection.on('connected', function() {
            console.log('Mongoose connection open to ' + uri);
        });
    }
};

const application = function() {
    var app = express();
    app.set('trust proxy', 'loopback');

    // middleware
    var bodyParser = require('body-parser');
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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

    app.get('/', function(req, res) { res.json({ status: 'success' }); });
    app.use('/api', require('./src/routes'));

    app.use(function errorHandler (err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        return res.status(500).json({ error: 'Unexpected error.' });
    });

    return app;
}

// CLI: start server
if (require.main === module) {

    const mediator = bootstrap.mediator();

    bootstrap.initAllEventListeners(mediator);
    bootstrap.mongo(mediator);

    var app = application();
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

    process.on('uncaughtException', function (err) {
        console.error(err);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, p) => {
      console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
      process.exit(1);
    });
}

module.exports.app = application;
module.exports.bootstrap = bootstrap;
