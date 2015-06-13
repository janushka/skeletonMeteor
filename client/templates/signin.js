const USER_AND_PASSWORD = 'Benutzername und Passwort eingeben';
const USER_NOT_FOUND = 'Benutzer nicht gefunden';
const WRONG_PASSWORD = 'Richtiges Passwort eingeben';
const EMPTY_STRING = '';

Template.Signin.onCreated(function () {
    this.validation = new ReactiveVar;
    this.validation.set('');
});

Template.Signin.events({
    'click .back-login': function () {
        Router.go('home');
    },

    'click .forward-login': function (e, template) {
        var userName = Template.instance().find('#usernameInput').value;
        var userPassword = Template.instance().find('#usernamePassword').value;

        Meteor.loginWithPassword(userName, userPassword, function (error) {
            if (error) {
                console.log('Login-Error: ' + error);
                template.validation.set(error);
            } else {
                console.log('Login-Success!');
                Router.go('booking_list');
            }
        });
    },

    'focus .uname': function (e, template) {
        template.validation.set(EMPTY_STRING);
    },

    'focus .upass': function (e, template) {
        template.validation.set(EMPTY_STRING);
    }
});

Template.Signin.helpers({
    validationMessage: function () {
        var valError = Template.instance().validation.get().message;

        switch (valError) {
            case 'Match failed [400]':
                return USER_AND_PASSWORD;
            case 'User not found [403]':
                return USER_NOT_FOUND;
            case 'Incorrect password [403]':
                return WRONG_PASSWORD;
            default:
                return EMPTY_STRING;
        }
    }
})
