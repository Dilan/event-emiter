const path = require('path');
const config = require('../../config');

const init = function(mediator) {
    return {
        onUserUpdate: function(user, diff) {

            // when [department] were changed
            diff.forEach((item) => {
                if (item['kind'] == 'E' && item['path'][0] == 'department') {
                    setTimeout(() => {
                        mediator.emit('websocket.message', 'Admin were notified')
                    }, 2500);
                }
            });
        }
    }
};

module.exports.init = init;
