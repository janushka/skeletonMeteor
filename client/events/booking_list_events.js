/**
 * Created by Njoku on 24.06.2015.
 */

// Template BookingList

Template.BookingList.events({
    'click a.searchForm': function (event, template) {
        var isf = !Session.get('isSearchForm').isSet;
        Session.set('isSearchForm', {
            isSet: isf,
            caller_template: 'booking_list'
        });
        Session.set('bookingListSearchFormEnabled', isf);
    },

    'click a.editBooking': function (event, template) {
        var bookingId = $(event.currentTarget).attr('booking-id');
        var categoryId = $(event.currentTarget).attr('category-id');
        Session.set('selectedBookingId', bookingId);
        Session.set('selectedCategoryId', categoryId);
    }
});

// Template searchFormBookingList

Template.searchFormBookingList.events({
    'click #search_booking_list_von_datum': function (event, template) {
        console.log('Von angeklickt!');
    },

    'click #search_booking_list_bis_datum': function (event, template) {
        console.log('Bis angeklickt!');
    },

    'change select': function (event, template) {
        event.preventDefault();
        var selectedCategoryId = $('#search_booking_list_category').val() == 'all' ? undefined : $('#search_booking_list_category').val();

        var datePicker = {};
        if (Session.get('datePicker') == undefined) {
            datePicker.categoryId = selectedCategoryId;
        } else {
            var datePicker = Session.get('datePicker');
            datePicker.categoryId = selectedCategoryId;
        }
        Session.set('datePicker', datePicker);
        console.log('Selected categoryId', selectedCategoryId);
    },
});
