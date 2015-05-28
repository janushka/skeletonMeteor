if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);

    Template.home.helpers({
        counter: function () {
            return Session.get('counter');
        }
    });

    Template.home.events({
        'click .do_not_submit': function (event) {
            event.preventDefault();
            var person = new Person('Janne', 'Njoku');
            // increment the counter when button is clicked
            //Session.set('counter', Session.get('counter') + 1);
            console.log(sex());
            console.log(sex());
            console.log('Do not submit button clicked... and the persons name is: ' + person.toString() + '\n' + sex());
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}

class Person {
    constructor(vorname, nachname) {
        this.vorname = vorname;
        this.nachname = nachname;
    }

    toString() {
        return this.vorname + ' ' + this.nachname;
    }

    static melden() {
        return 'Hallo hier spricht die Zentrale!';
    }
}

function sex() {
    var s = 'I am woman!';
    sex = function() {
        return 'I am a son of God!';
    }
    return s;
}
