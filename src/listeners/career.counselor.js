const path = require('path');
const config = require('../../config');

const init = function(mediator) {
    return {
        /**
            diff: [ DiffEdit { kind: 'E', path: [ 'department' ], lhs: 'SWE', rhs: 'Analitics' }]
        */
        notifyOnChangingDepartment: function(user, diff) {
            console.log('Career.Counselor Listener :: Check is user has changed department ...', user, diff);


            // when [department] were changed
            diff.forEach((item) => {
                if (item['kind'] == 'E' && item['path'][0] == 'department') {
                    console.log(`Career counselor were notified on changing department`);
                }
            });
        }
    }
};

module.exports.init = init;
