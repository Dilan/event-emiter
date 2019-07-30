const path = require('path');
const config = require('../../config');

const init = function(mediator) {
    return {
        onUserCreate: function(user) {
            console.log('Email Listener :: on User created', user);

            setTimeout(() => {
                mediator.emit('websocket.message', `user ${user.id} were created.`)
            }, 1000);

        },

        /**
            diff: [ DiffEdit { kind: 'E', path: [ 'amount' ], lhs: 1300, rhs: 5300 }]
        */
        onUserUpdate: function(user, diff) {
            console.log('Email Listener :: on User changed', diff);

            var msgList = [];
            diff.forEach((item) => {
                if (item['kind'] == 'E') {
                    msgList.push(`(${item['path'][0]}) ${item.lhs} --> ${item.rhs}`);
                }
            });

            setTimeout(() => {
                mediator.emit('websocket.message', msgList.join(' / '))
            }, 1000);
            
        }
    }
};

module.exports.init = init;
