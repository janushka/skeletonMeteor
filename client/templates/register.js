const USERNAME_EXISTS = 'Benutzername existiert bereits';
const USERNAME_EMPTY = 'Benutzername darf nicht leer sein';
const USER_CREATION = 'Benutzer wurde erfolgreich angelegt';
const USER_CREATION_SUCCESS = {message: 'User was successfully created [200]'};
const PASSWORD_EMPTY = 'Passwort darf nicht leer sein';
const PASSWORDS_NON_IDENTICAL = 'Passwörter stimmen nicht überein';
const PASSWORDS_DIFFERENT = {message: 'Passwords may not be different [400]'};
const EMPTY_STRING = '';

Template.Register.onCreated(function () {
    this.validation = new ReactiveVar;
    this.validation.set('');
    this.user_creation_success = new ReactiveVar;
    this.user_creation_success.set(false);
});

Template.Register.events({
    'click .back-register': function () {
        Router.go('home');
    },

    'click .forward-register': function (e, template) {
        var userName = Template.instance().find('#usernameInput').value;
        var userPassword = Template.instance().find('#usernamePassword').value;
        var userPasswordConfirm = Template.instance().find('#usernamePasswordConfirm').value;

        if (userPassword !== userPasswordConfirm) {
            template.validation.set(PASSWORDS_DIFFERENT);
            return;
        }

        Accounts.createUser({username: userName, password: userPassword}, function (error) {
            if (error) {
                console.log('UserCreation-Error: ' + error);
                template.validation.set(error);
            } else {
                console.log('UserCreation-Success!');
                //Router.go('signin');
                //template.user_creation_success.set(true);
                template.validation.set(USER_CREATION_SUCCESS);
            }
        })
    },

    'focus .uname': function (e, template) {
        template.validation.set(EMPTY_STRING);
    },

    'focus .upass': function (e, template) {
        template.validation.set(EMPTY_STRING);
    },

    'focus .upass-confirm': function (e, template) {
        template.validation.set(EMPTY_STRING);
    }
});

Template.Register.helpers({
    validationMessage: function () {
        var valError = Template.instance().validation.get().message;

        switch (valError) {
            case 'Need to set a username or email [400]':
                return USERNAME_EMPTY;
            case 'Password may not be empty [400]':
                return PASSWORD_EMPTY;
            case PASSWORDS_DIFFERENT.message:
                return PASSWORDS_NON_IDENTICAL;
            case 'Username already exists. [403]':
                return USERNAME_EXISTS;
            case USER_CREATION_SUCCESS.message:
                return USER_CREATION;
            default:
                return EMPTY_STRING;
        }
    }
});


