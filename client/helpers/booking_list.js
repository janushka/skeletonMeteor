/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingList.onCreated(function() {
    Meteor.subscribe("bookings");
});

Template.BookingList.helpers({
    bookings: function () {
        var results = Bookings.find();
        return results;
    },
    datum: function () {
        var d = moment(this.datum).format('DD.MM.YYYY');
        return d;
    },
    amount: function () {
        //var amountFormatted = S(this.amount);
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
