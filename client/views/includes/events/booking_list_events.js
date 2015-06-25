/**
 * Created by Njoku on 24.06.2015.
 */

Template.BookingList.events({
    'click #edit_booking': function (event, template) {
        var category = template.find('#new_booking_category').value;
        Session.set('selectedCategory', category);
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

