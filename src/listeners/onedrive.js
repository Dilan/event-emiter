const init = function(mediator) {
    return {
        createAccount: function(user) {
            console.log('OneDrive Listener :: Create Account on User create', user);
        },
    }
};

module.exports.init = init;
