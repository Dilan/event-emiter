const careerCounselor = require('./career.counselor');
const accountManager = require('./account.manager');
const onedrive = require('./onedrive');

module.exports.init = function(mediator) {
    return {
        careerCounselor:    careerCounselor.init(mediator),
        accountManager:     accountManager.init(mediator),
        onedrive:           onedrive.init(mediator),
    };
}
