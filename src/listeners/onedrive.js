const init = function(mediator) {
    return {
        createAccount: function(user) {
            console.log('OneDrive Listener :: Create Account on User create', user);

            setTimeout(() => {
                mediator.emit('websocket.message', `OneDrive for user ${user.id} were created.`)
            }, 1000);
        },
    }
};

module.exports.init = init;
