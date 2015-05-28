Template.Login.events({
    'click .login': function() {
        Router.go('signin');
    },

    'click .register': function() {
        Router.go('register');
    }
});
