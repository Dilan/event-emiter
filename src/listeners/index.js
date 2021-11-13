const careerCounselorInit = require('./career.counselor').init;
const accountManagerInit = require('./account.manager').init;
const onedriveInit       = require('./onedrive').init;

module.exports.initAllListeners = function(mediator) {

    const careerCounselor = careerCounselorInit(mediator);
    const accountManager  = accountManagerInit(mediator);
    const onedrive        = onedriveInit(mediator);
    
    mediator.on('users.create', onedrive.createAccount);
    mediator.on('users.create', accountManager.notifyOnNewUser);
    mediator.on('users.update', accountManager.notifyOnUserUpdate);
    mediator.on('users.update', careerCounselor.notifyOnChangingDepartment);
}
