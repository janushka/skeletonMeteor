/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingEdit.events({
    'click #save_booking': function (event, template) {
        event.preventDefault();

        var bookingData = {};
        var bookingId = template.data.booking._id;
        bookingData.amount = S(template.find('#edit_booking_amount').value).replaceAll(',', '.').toFloat(2);
        bookingData.datum = template.find('#edit_booking_datum').value;
        bookingData.category = S(template.find('#edit_booking_category').value).collapseWhitespace().s;
        bookingData.remark = S(template.find('#edit_booking_remark').value).collapseWhitespace().s;

        var currentAmount = S(template.data.booking.amount).toFloat(2);
        var diffDates = moment(bookingData.datum, 'DD-MM-YYYY').isSame(template.data.booking.datum, 'DD-MM-YYYY');

        if (bookingData.amount === currentAmount && diffDates
            && bookingData.category === template.data.booking.category && bookingData.remark === template.data.booking.remark) {
            // Session variable will be checked on true in "ifNoChangesCategory"-Template.
            Session.set('bookingNoChangesAlert', true);
            return;
        }

        var currentCategory = Categories.findOne({name: bookingData.category})

        Bookings.update({_id: bookingId}, {
            amount: bookingData.amount,
            datum: moment(bookingData.datum, 'DD-MM-YYYY').toDate(),
            categoryId: currentCategory._id,
            category: bookingData.category,
            remark: bookingData.remark
        });

        // Update CategoriesAmount-Collection immediately.
        ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));

        // Session variable will be checked on true in "ifEditBooking"-Template. //
        Session.set('bookingUpdatedAlert', true);

        console.log("You just updated a booking.");
    },
    'click #delete_booking': function (event, template) {
        event.preventDefault();

        var bookingId = template.data.booking._id;
        Bookings.remove({_id: bookingId});

        // Update CategoriesAmount-Collection immediately.
        ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));

        // Session variable will be checked on true in "ifDeleteBooking"-Template.
        Session.set('bookingDeletedAlert', true);

        // Reset all input-fields
        ManipulateCategoriesAmounts.resetForm(template, ['#edit_booking_amount', '#edit_booking_datum', '#edit_booking_category', '#edit_booking_remark']);

        console.log("You just deleted a booking.");
    },

    'click #close_acknowledge_edit_booking': function (event, template) {
        event.preventDefault();
        Session.set('bookingUpdatedAlert', false);
    },

    'click #close_acknowledge_nochanges_booking': function (event, template) {
        event.preventDefault();
        Session.set('bookingNoChangesAlert', false);
    },

    'click #close_acknowledge_delete_booking': function (event, template) {
        event.preventDefault();
        Session.set('bookingDeletedAlert', false);
    },

    'focus': function (event, template) {
        event.preventDefault();
        // Session variable will be checked on false once a field gains focus.
        Session.set('bookingNoChangesAlert', false);
        Session.set('bookingUpdatedAlert', false);
        Session.set('bookingDeletedAlert', false);
    }
});
