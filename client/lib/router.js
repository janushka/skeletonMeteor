Router.configure({
    // we use the  appBody template to define the layout for the entire app
    layoutTemplate: 'appBody',

    // the appNotFound template is used for unknown routes and missing lists
    //notFoundTemplate: 'appNotFound',

    // show the appLoading template whilst the subscriptions below load their data
    //loadingTemplate: 'appLoading',

    // wait on the following subscriptions before rendering the page to ensure
    // the data it's expecting is present
    /*waitOn: function() {
     return [
     Meteor.subscribe('publicLists'),
     Meteor.subscribe('privateLists')
     ];
     }*/
});

dataReadyHold = null;

//if (Meteor.isClient) {
    // Keep showing the launch screen on mobile devices until we have loaded
    // the app's data
    //dataReadyHold = LaunchScreen.hold();

    // Show the loading screen on desktop
    //Router.onBeforeAction('loading', {except: ['join', 'signin']});
    //Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
//}

Router.map(function () {
    this.route('signin', {
        path: '/signin',
        action: function () {
            this.render('LoginHeader', {to: 'header'});
            this.render('Signin', {to: 'login'});
        }
    });

    this.route('register', {
        path: '/register',
        action: function () {
            this.render('LoginHeader', {to: 'header'});
            this.render('Register', {to: 'login'});
        }
    });

    this.route('home', {
        path: '/',
        action: function () {
            this.render('LoginHeader', {to: 'header'});
            this.render('Login', {to: 'login'});
            this.render('', {to: 'content'});
        }
    });

    this.route('booking_list', {
        path: '/booking_list',
        controller: 'BookingsListController'

    });

    this.route('booking_new', {
        path: '/booking_new',
        controller: 'BookingNewController'

    });
});

// CONTROLLERS

BookingsListController = RouteController.extend({
    increment: 5,
    bookingsLimit: function () {
        return parseInt(this.params.bookingsLimit) || this.increment;
    },
    findOptions: function () {
        return {sort: {datum: -1}, limit: this.bookingsLimit()};
    },
    waitOn: function () {
        return [Meteor.subscribe('limitedBookings', this.findOptions()), Meteor.subscribe('categories')];
    },
    bookings: function () {
        return Bookings.find({}, this.findOptions());
    },
    data: function () {
        var hasMore = this.bookings().count() === this.bookingsLimit();
        var nextPath = this.route.path({bookingsLimit: this.bookingsLimit() + this.increment});
        return {bookings: this.bookings(), categories: Categories.find(), nextPath: hasMore ? nextPath : null};
    },
    onBeforeAction: function () {
        if (!Meteor.userId()) {
            Router.go('home');
        } else {
            // otherwise don't hold up the rest of hooks or our route/action function
            // from running
            this.next();
        }
    },
    action: function () {
        if (this.ready()) {
            this.render('ContentHeader', {to: 'header'});
            this.render('Navigation', {to: 'navigation'});
            this.render('BookingList', {to: 'content'});

            setTimeRangeInSession();

            Session.set('bookingsLimit', this.bookingsLimit());
            console.log('Template can be rendered!');
            //this.render();
        }
    }
});

BookingNewController = RouteController.extend({
    onBeforeAction: function () {
        if (!Meteor.userId()) {
            Router.go('home');
        } else {
            // otherwise don't hold up the rest of hooks or our route/action function
            // from running
            this.next();
        }
    },
    action: function () {
        if (this.ready()) {
            this.render('ContentHeader', {to: 'header'});
            this.render('Navigation', {to: 'navigation'});
            this.render('BookingNew', {to: 'content'});
        }
    }
});

function setTimeRangeInSession() {
    if (Session.get('timeRange') === undefined) {
        Session.set('timeRange', 'all');
    }
}
