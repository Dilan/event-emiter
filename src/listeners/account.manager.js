const path = require('path');
const config = require('../../config');

const init = function(mediator) {
    return {
        notifyOnNewUser: function(user) {
            console.log('Account.Manager Listener :: send notification on User create', user);
        },

        /**
            diff: [ DiffEdit { kind: 'E', path: [ 'name' ], lhs: 'Anton', rhs: 'Anthony' }]
        */
        notifyOnUserUpdate: function(user, diff) {
            console.log('Account.Manager Listener :: send notification on User update', user);
        }
    }
};

module.exports.init = init;
