var path = require('path');
var convict = require('convict');
var rootPath = path.resolve(path.join(__dirname, '..'));

var config = convict({
    env: {
        doc: 'Application environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    app: {
        ip: {
            doc: 'The IP address to bind.',
            default: '127.0.0.1',
            env: 'IP_ADDRESS'
        },
        port: {
            doc: 'The port to bind.',
            default: 5001,
            env: 'PORT'
        }
    },
    mongo: {
        database: {
            doc: 'Mongo database',
            format: '*',
            default: 'events',
            env: 'MONGO_DB'
        },
        address: {
            doc: 'Mongo address',
            format: '*',
            default: '127.0.0.1',
            env: 'MONGO_PORT_27017_TCP_ADDR'
        },
        port: {
            doc: 'Mongo port',
            format: 'port',
            default: 27017,
            env: 'MONGO_PORT_27017_TCP_PORT'
        },
        uri: '' // mongodb://127.0.0.1:27017/gift
    }
});

// Load environment dependent configuration
config.loadFile('./config/' + config.get('env') + '.json');
config.set(
    'mongo.uri',
    'mongodb://' + config.get('mongo.address') + ':' + config.get('mongo.port') + '/' + config.get('mongo.database')
);

// Perform validation
config.validate();

module.exports = config.getProperties();
