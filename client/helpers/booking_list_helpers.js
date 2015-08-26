/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingList.onCreated(function () {
    Meteor.subscribe("bookings");
    this.autorun(function () {
        if (Bookings.find().count() == 0) {
            Session.set('notification', {
                caller_template: 'booking_list',
                type: 'Info: ',
                text: 'Derzeit keine Buchung(en) im System!'
            });
            Session.set('bookingsExist', false);
        } else {
            Session.set('notification', undefined);
            Session.set('bookingsExist', true);
        }
    });
});

Template.BookingList.helpers({
    bookingsExist: function () {
        return Session.get('bookingsExist');
    },

    bookings: function () {
        var results = Bookings.find();
        return results;
    },

    datum: function () {
        var d = moment(this.datum).format('DD.MM.YYYY');
        return d;
    },

    amount: function () {
        var amountFormatted = S(this.amount).replaceAll('.', ',');
        return amountFormatted;
    },

    categoryTitle: function () {
        if (Session.get('bookingListByCategory') === undefined || Session.get('bookingListByCategory') === 'all') {
            return ''
        }
        return '(' + Session.get('bookingListByCategory') + ')';
    },

    nextPath: function () {
        if (Session.get('loadMoreBookings')) {
            var path = Session.get('bookingsLimit') + 5;
            return path;
        }
    }
});
