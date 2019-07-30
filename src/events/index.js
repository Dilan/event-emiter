
/**
    diff: [ DiffEdit { kind: 'E', path: [ 'amount' ], lhs: 1300, rhs: 5300 }]
*/

const init = function(mediator, key) {

    var onUserCreate = function(user) {
        console.log('Email Listener :: on User created', user);

        setTimeout(() => {
            mediator.emit('websocket.message', `user ${user.id} were created.`)
        }, 1000);
    };

    var onUserUpdate = function (user, diff) {
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

    switch (key) {
        case 'email':
            mediator.on('users.update', onUserUpdate);
            mediator.on('users.create', onUserCreate);
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
