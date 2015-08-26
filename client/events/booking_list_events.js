/**
 * Created by Njoku on 24.06.2015.
 */

Template.BookingList.events({
    'click a.editBooking': function (event, template) {
        var bookingId = $(event.currentTarget).attr('booking-id');
        var categoryId = $(event.currentTarget).attr('category-id');
        Session.set('selectedBookingId', bookingId);
        Session.set('selectedCategoryId', categoryId);
    }
});

