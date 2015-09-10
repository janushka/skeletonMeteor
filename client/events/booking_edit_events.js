/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingEdit.events({
    'click #save_booking': function (event, template) {
        event.preventDefault();

        var currentBooking = Bookings.findOne({_id: Session.get('selectedBookingId')});

        var localBooking = {};
        localBooking._id = Session.get('selectedBookingId');
        localBooking.amount = S($('#edit_booking_amount').val()).replaceAll(',', '.').toFloat(2);
        localBooking.datum = moment($('#edit_booking_datum').val(), 'DD-MM-YYYY').toDate();
        localBooking.categoryId = S($('#edit_booking_category').val()).collapseWhitespace().s;
        localBooking.category = S($('#edit_booking_category option:selected').text()).collapseWhitespace().s;
        localBooking.remark = S($('#edit_booking_remark').val()).collapseWhitespace().s;
        if ($('#edit_booking_fix_expense').prop('checked')) {
            if (currentBooking.fixExpenseId == undefined) {
                localBooking.fixExpenseId = Random.id();
            } else {
                localBooking.fixExpenseId = currentBooking.fixExpenseId;
            }
        }

        if (_.isEqual(localBooking, currentBooking)) {
            Session.set('notification', {
                caller_template: 'booking_edit',
                type: 'Warnung: ',
                text: 'Keine Änderungen festgestellt. Speichern abgebrochen!'
            });
            return;
        }

        Meteor.call('updateBooking', localBooking, function (error) {
            if (error) {
                console.log('UpdateBooking:', error);
                Session.set('notification', {
                    caller_template: 'booking_edit',
                    type: 'Fehler: ',
                    text: ' Buchung nicht ändernbar.'
                });
            } else {
                console.log('UpdateBooking: Success when updating booking(s)');
                Session.set('notification', {
                    caller_template: 'booking_edit',
                    type: 'Bestätigung: ',
                    text: 'Buchung erfolgreich geändert.'
                });
            }
        });
    },

    'click #delete_booking': function (event, template) {
        event.preventDefault();

        Meteor.call('deleteBooking', Session.get('selectedBookingId'), function (error) {
            if (error) {
                console.log('DeleteBooking:', error);
            } else {
                console.log('DeleteBooking: Success when deleting booking with Id', Session.get('selectedBookingId'));
                Session.set('notification', {
                    caller_template: 'booking_edit',
                    type: 'Bestätigung: ',
                    text: 'Buchung erfolgreich gelöscht.'
                });
            }
        });
    },

    'change select': function (event, template) {
        event.preventDefault();
        var selectedCategoryId = $('#edit_booking_category').val();
        Session.set('selectedCategoryId', {
            caller_template: 'booking_edit',
            categoryId: selectedCategoryId
        });
        console.log('Selected categoryId', selectedCategoryId);
    },

    'focus': function (event, template) {
        event.preventDefault();
        Session.set('notification', undefined);
    }
});
