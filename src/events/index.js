
const listeners = {
    email: require('../listeners/email'),
    admin: require('../listeners/admin'),
};

const init = function(mediator, key) {
    var eeEmail = listeners.email.init(mediator);
    var eeAdmin = listeners.admin.init(mediator);

    switch (key) {
        case 'email':
            mediator.on('users.update', eeEmail.onUserUpdate);
            mediator.on('users.create', eeEmail.onUserCreate);
            break;

        case 'admin':
            mediator.on('users.update', function(user, diff) {
                // when [department] were changed
                diff.forEach((item) => {
                    if (item['kind'] == 'E' && item['path'][0] == 'department') {
                        setTimeout(() => {
                            mediator.emit('websocket.message', 'Admin were notified')
                        }, 2500);
                    }
                });
            });
            break;
    }
}

const initAll = function(mediator) {
    init(mediator, 'email');
    init(mediator, 'admin');
}

module.exports.initAll = initAll;
module.exports.init = init;
