/**
 * Created by Njoku on 24.06.2015.
 */

Template.BookingList.events({
    'click a.editBooking': function (event, template) {
        var bookingId = $(event.currentTarget).attr('data-id');
        Session.set('selectedBookingId', bookingId);
    },

    'click #close_category_alert': function (event, template) {
        event.preventDefault();
        Session.set('categoriesAlert', true);
    },

    'focus': function (event, template) {
        event.preventDefault();
        // Session variable will be checked on false once a field gains focus.
        Session.set('bookingAddedAlert', false);
    }
});

