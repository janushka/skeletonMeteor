/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingNew.events({
    'click #submit_booking': function (event, template) {
        event.preventDefault();

        var localBooking = {};
        localBooking.amount = S($('#new_booking_amount').val()).replaceAll(',', '.').toFloat(2);
        localBooking.datum = moment($('#new_booking_datum').val(), 'DD-MM-YYYY').toDate();
        localBooking.category = Categories.findOne({_id: Session.get('selectedCategoryId').categoryId}).name;
        localBooking.categoryId = Session.get('selectedCategoryId').categoryId;
        localBooking.remark = S($('#new_booking_remark').val()).collapseWhitespace().s;


        var bookingId = Bookings.insert(localBooking, function (error, id) {
            if (error) {
                console.log('Error when inserting booking!');
                Session.set('notification', {
                    caller_template: 'booking_new',
                    type: 'Fehler: ',
                    text: 'Buchung nicht speicherbar.'
                });
            } else {
                console.log('Success when inserting booking with ID = ' + id);
                // Update CategoriesAmount-Collection immediately.
                //ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));
                //ManipulateCategoriesAmounts.updateCategoriesByRange('all');
                Session.set('notification', {
                    caller_template: 'booking_new',
                    type: 'Bestätigung: ',
                    text: 'Buchung erfolgreich gespeichert.'
                });
                // Reset all input-fields
                resetFields(template, ['#new_booking_amount', '#new_booking_datum', '#new_booking_category', '#new_booking_remark']);
            }
        });

        function resetFields(template, fieldnames) {
            _.each(fieldnames, function (element, index, list) {
                $(element).val('');
            });
        }
    },

    'change select': function (event, template) {
        event.preventDefault();
        var selectedCategoryId = $('#new_booking_category').val();
        Session.set('selectedCategoryId', {
            caller_template: 'booking_new',
            categoryId: selectedCategoryId
        });
        console.log('Selected categoryId', selectedCategoryId);
    },

    'focus': function (event, template) {
        event.preventDefault();
        Session.set('notification', undefined);
    }
});
