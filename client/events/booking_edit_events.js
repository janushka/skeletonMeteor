/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingEdit.events({
    'click #save_booking': function (event, template) {
        event.preventDefault();

        var localBooking = {};
        localBooking._id = Session.get('selectedBookingId');
        localBooking.amount = S(template.find('#edit_booking_amount').value).replaceAll(',', '.').toFloat(2);
        localBooking.datum = moment(template.find('#edit_booking_datum').value, 'DD-MM-YYYY').toDate();
        localBooking.categoryId = S(template.find('#edit_booking_category').value).collapseWhitespace().s;
        localBooking.category = S($("#edit_booking_category option:selected").text()).collapseWhitespace().s;
        localBooking.remark = S(template.find('#edit_booking_remark').value).collapseWhitespace().s;

        var currentBooking = Bookings.findOne({_id: Session.get('selectedBookingId')});

        if (_.isEqual(localBooking, currentBooking)) {
            Session.set('notification', {
                caller_template: 'booking_edit',
                type: 'Warnung: ',
                text: 'Keine Änderungen festgestellt. Speichern abgebrochen!'
            });
            return;
        }

        var affectedBooking = Bookings.update({_id: Session.get('selectedBookingId')}, localBooking, function (error, ids) {
            if (error) {
                console.log('Error when updating booking!');
                Session.set('notification', {
                    caller_template: 'booking_edit',
                    type: 'Fehler: ',
                    text: ' Buchung nicht ändernbar.'
                });
            } else {
                console.log('Success when updating ' + ids + ' bookings');
                // Update CategoriesAmount-Collection immediately.
                //ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));
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

        var affectedBooking = Bookings.remove({_id: Session.get('selectedBookingId')}, function (error) {
            if (error) {
                console.log('Error when deleting booking!');
                Session.set('notification', {
                    caller_template: 'booking_edit',
                    type: 'Fehler: ',
                    text: 'Buchung nicht löschbar.'
                });
            } else {
                console.log('Success when removing booking with ID = ' + Session.get('selectedBookingId'));
                // Update CategoriesAmount-Collection immediately.
                //ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));
                Session.set('notification', {
                    caller_template: 'booking_edit',
                    type: 'Bestätigung: ',
                    text: 'Buchung erfolgreich gelöscht.'
                });
            }
        });
    },

    'focus': function (event, template) {
        event.preventDefault();
        // Session variables will be checked on false once a field gains focus.
        Session.set('notification', undefined);
    }
});
