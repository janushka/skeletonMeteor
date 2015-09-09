/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingNew.events({
    'click #submit_booking': function (event, template) {
        event.preventDefault();

        var localBooking = {};
        // adding _id to the localBooking inside the client
        // By doing this, we no longer rely on the server result to get the bookingId
        localBooking._id = Random.id();
        localBooking.amount = S($('#new_booking_amount').val()).replaceAll(',', '.').toFloat(2);
        localBooking.datum = moment($('#new_booking_datum').val(), 'DD-MM-YYYY').toDate();
        localBooking.category = Categories.findOne({_id: Session.get('selectedCategoryId').categoryId}).name;
        localBooking.categoryId = Session.get('selectedCategoryId').categoryId;
        localBooking.remark = S($('#new_booking_remark').val()).collapseWhitespace().s;
        if ($('#new_booking_fix_expense').prop('checked')) {
            localBooking.fixExpenseId = Random.id();
        }

        Meteor.call('createBooking', localBooking, function (error) {
            if (error) {
                console.log('CreateBooking:', 'Error when inserting booking.');
                Session.set('notification', {
                    caller_template: 'booking_new',
                    type: 'Fehler: ',
                    text: 'Buchung nicht speicherbar.'
                });
            } else {
                console.log('CreateBooking: Success when inserting booking');
                Session.set('notification', {
                    caller_template: 'booking_new',
                    type: 'Bestätigung: ',
                    text: 'Buchung erfolgreich angelegt und gespeichert.'
                });
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
