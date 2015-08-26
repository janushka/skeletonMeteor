Router.configure({
    // we use the  appBody template to define the layout for the entire app
    layoutTemplate: 'appBody',
    // the appNotFound template is used for unknown routes and missing lists
    //notFoundTemplate: 'appNotFound',
    // show the appLoading template whilst the subscriptions below load their data
    //loadingTemplate: 'appLoading',
});

Router.route('home', {
    path: '/',
    action: function () {
        this.render('LoginHeader', {to: 'header'});
        this.render('Login', {to: 'login'});
        this.render('', {to: 'content'});
    }
});

Router.route('signin', {
    path: '/signin',
    action: function () {
        this.render('LoginHeader', {to: 'header'});
        this.render('Signin', {to: 'login'});
    }
});

Router.route('register', {
    path: '/register',
    action: function () {
        this.render('LoginHeader', {to: 'header'});
        this.render('Register', {to: 'login'});
    }
});

Router.route('booking_list', {
    path: '/booking_list/:bookingsLimit?',
    controller: 'BookingsListController',
    template: 'BookingList',
});

Router.route('booking_new', {
    path: '/booking_new',
    controller: 'BookingNewController'
});

Router.route('booking_edit', {
    //path: '/booking_edit',
    path: '/booking_edit/:_id/category/:category',
    controller: 'BookingEditController'

});

Router.route('category_new', {
    path: '/category_new',
    controller: 'CategoryNewController'

});

Router.route('category_edit', {
    path: '/category_edit/:_id?',
    controller: 'CategoryEditController'

});

Router.route('statistic', {
    path: '/statistic',
    controller: 'StatisticController'
});

Router.route("test", {
    path: "/test",

    waitOn: function () {
        return Meteor.subscribe('authors');
    },
    data: function () {
        templateData = {authors: Authors.find().fetch()};
        return templateData;
    },
    action: function () {
        console.log("The data is ", this.data().authors);
    },
    onAfterAction: function () {
        Meteor.call('getSomeAuthors', 'Janne', function (error, result) {
            console.log("The result is ", result);
        });
    }

    //   data: function() {
    //console.log("The DATA is ", Util.getResponse("getSomeAuthors")[0]);

    //},
    //action: function () {
    //console.log("The data is ", Util.getResponse("getSomeAuthors")[0]);
    //  this.data();
    //},
    //waitOn: function () {
    // Call the async function, with an optional data argument
    //  return Util.waitOnServer("getSomeAuthors", {name: 'Janne'});
    //return Util.waitOnServer("testWaitOn", {foo: "bar"}, {bar: "foo"}, {name: 'Janne'});
    //}
});

// CONTROLLERS

HomeController = RouteController.extend({
    action: function () {
        this.render('LoginHeader', {to: 'header'});
        this.render('Login', {to: 'login'});
        this.render('', {to: 'content'});
    }
});

BookingsListController = RouteController.extend({
    increment: 5,
    /*bookingsLimit: function () {
     return parseInt(this.params.bookingsLimit) || this.increment;
     },*/
    findOptions: function () {
        return {sort: {datum: -1}, limit: 10};
        //return {sort: {datum: -1}, limit: this.bookingsLimit()};
    },
    waitOn: function () {
        //return [Util.waitOnServer("getLimitedBookings", this.findOptions()), Util.waitOnServer("getAllCategories")];
        //return Meteor.subscribe('limitedBookings', this.findOptions());
        return Meteor.subscribe('bookings', this.findOptions());
    },
    /*bookings: function () {
     return Bookings.find({}, this.findOptions());
     },*/
    data: function () {
        //return {bookings: Bookings.find({}, this.findOptions())};
        //var tempBooks = this.bookings();
        //var hasMore = this.bookings().count() === this.bookingsLimit();
        //var hasMore = this.bookings().count() === this.bookingsLimit();
        //var nextPath = this.route.path({bookingsLimit: this.bookingsLimit() + this.increment});
        //return {bookings: this.bookings(), categories: Categories.find(), nextPath: hasMore ? nextPath : null};
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
            //setTimeRangeInSession();
            console.log('Template BookingList rendered');
            //Session.set('bookingsLimit', this.bookingsLimit());
            //this.render();
        }
    }
});

BookingNewController = RouteController.extend({
    waitOn: function () {
        return [Meteor.subscribe('bookings'), Meteor.subscribe('categories')];
    },
    onBeforeAction: function () {
        if (!Meteor.userId()) {
            Router.go('home');
        } else {
            this.next();
        }
    },
    action: function () {
        if (this.ready()) {
            this.render('ContentHeader', {to: 'header'});
            this.render('Navigation', {to: 'navigation'});
            this.render('BookingNew', {to: 'content'});
            console.log('Template BookingNew rendered');
        }
    }
});

BookingEditController = RouteController.extend({
    onBeforeAction: function () {
        if (!Meteor.userId()) {
            Router.go('home');
        } else {
            this.next();
        }
    },
    action: function () {
        if (this.ready()) {
            this.render('ContentHeader', {to: 'header'});
            this.render('Navigation', {to: 'navigation'});
            this.render('BookingEdit', {to: 'content'});
            console.log('Template BookingEdit rendered');
        }
    }
});

CategoryNewController = RouteController.extend({
    onBeforeAction: function () {
        if (!Meteor.userId()) {
            Router.go('home');
        } else {
            this.next();
        }
    },
    action: function () {
        if (this.ready()) {
            this.render('ContentHeader', {to: 'header'});
            this.render('Navigation', {to: 'navigation'});
            this.render('CategoryNew', {to: 'content'});
            console.log('Template CategoryNew rendered');
        }
    }
});

CategoryEditController = RouteController.extend({
    waitOn: function () {
        return [Meteor.subscribe('bookings'), Meteor.subscribe('categories')];
    },
    data: function () {
        var templateData = {category: Categories.findOne(this.params._id)};
        //var templateData = {category: Categories.findOne({name: Session.get('selectedCategory')})};
        return templateData;
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
            this.render('CategoryEdit', {to: 'content'});
            console.log('Template CategoryEdit rendered');
        }
    }
});

StatisticController = RouteController.extend({
    waitOn: function () {
        return [Meteor.subscribe('amounts'), Meteor.subscribe('categories')];
    },
    data: function () {
        templateData = {amounts: Amounts.find(), categories: Categories.find()};
        return templateData;
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
            this.render('Statistic', {to: 'content'});
            console.log('Template Statistics rendered');
        }
    }
});

function setTimeRangeInSession() {
    if (Session.get('timeRange') === undefined) {
        Session.set('timeRange', 'all');
    }
}
