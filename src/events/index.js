const notifyListener    = require('./notifyListener');
const websocketListener = require('./wsListener');

const initAllListeners = function(mediator) {

    // notify listener (sms / email / push .. etc)
    let nl = notifyListener.init(mediator);

    mediator.on('users.update', nl.onUserUpdate);
    mediator.on('users.create', nl.onUserCreate);

    // UI listener (websocket)
    let wl = websocketListener.init(mediator);

    mediator.on('users.create', wl.onUserCreate);
    mediator.on('users.update', wl.onUserUpdate);
}

module.exports.initAllListeners = initAllListeners;

