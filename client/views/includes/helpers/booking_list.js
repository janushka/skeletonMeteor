/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingList.helpers({
    bookings: function () {
        var cat = Session.get('bookingListByCategory');
        var tR;
        Session.get('timeSpecialRange') === undefined ? tR = Session.get('timeRange') : tR = Session.get('timeSpecialRange');
        var results = ManipulateCategoriesAmounts.getBookingList(cat, tR);

        var bookingsCountWithNoLimit = ManipulateCategoriesAmounts.getBookingsCount(cat, tR);
        //var bookingsCountWithNoLimit = Bookings.find().count();

        console.log('Length of array results: ' + bookingsCountWithNoLimit);
        console.log('Value of Session-variable bookingsLimit: ' + Session.get('bookingsLimit'));

        if (Session.get('bookingsLimit') < bookingsCountWithNoLimit) {
            Session.set('loadMoreBookings', true);
        } else {
            Session.set('loadMoreBookings', false);
        }

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
