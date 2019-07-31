const path = require('path');
const config = require('../../config');

const init = function(mediator) {
    return {
        notifyOnNewUser: function(user) {
            console.log('Account.Manager Listener :: send notification on User create', user);

            setTimeout(() => {
                mediator.emit('websocket.message', `Account manager notified on user ${user.id} create`)
            }, 1000);

        },

        /**
            diff: [ DiffEdit { kind: 'E', path: [ 'name' ], lhs: 'Anton', rhs: 'Anthony' }]
        */
        notifyOnUserUpdate: function(user, diff) {
            console.log('Account.Manager Listener :: send notification on User update', user);

            setTimeout(() => {
                mediator.emit('websocket.message', `Account manager notified on user update`)
            }, 1000);
        }
    }
};

module.exports.init = init;
