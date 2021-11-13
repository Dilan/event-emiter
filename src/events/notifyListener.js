const path = require('path');
const config = require('../../config');

const init = function(mediator) {
    return {
        onUserCreate: function(user) {
            console.log('Notify Listener :: on User created', user);

            setTimeout(() => {
                mediator.emit('websocket.message', `user ${user.id} were created.`)
            }, 1000);

        },

        /**
            diff: [ DiffEdit { kind: 'E', path: [ 'amount' ], lhs: 1300, rhs: 5300 }]
        */
        onUserUpdate: function(user, diff) {
            console.log('Notify Listener :: on User changed', diff);

            // when [department] were changed
            diff.forEach((item) => {
                if (item['kind'] == 'E' && item['path'][0] == 'department') {

                    // send email on department chanage:
                    console.log('execute ----> notifyGatewayAPI.changeDepartmentNotification(user)')

                    setTimeout(() => {
                        mediator.emit('websocket.message', 'Admin were notified')
                    }, 2500);
                }
            });
        }
    }
};

module.exports.init = init;