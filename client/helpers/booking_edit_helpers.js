/**
 * Created by Njoku on 24.06.2015.
 */

Template.BookingEdit.onCreated(function () {
    Meteor.subscribe('bookings');
    Meteor.subscribe('categories');

    if (Session.equals('selectedBookingId', undefined)) {
        Session.set('notification', {
            caller_template: 'booking_edit',
            type: 'Fehler: ',
            text: 'Keine Buchung ausgewählt!'
        });
    } else {
        Session.set('notification', undefined);
    }
});

Template.BookingEdit.rendered = function () {
    var picker = new Pikaday({
        field: document.getElementById('edit_booking_datum'),
        format: 'DD.MM.YYYY',
        onSelect: function () {
            console.log(this.getMoment().format('DD.MM.YYYY'));
        }
    });
};

Template.BookingEdit.helpers({
    booking: function () {
        return Bookings.findOne({_id: Session.get('selectedBookingId')});
    },

    categoryId: function () {
        return Categories.find({}, {
            fields: {
                name: 1,
                _id: 1
            }
        });
    },

    isSelected: function () {
        return Session.equals('selectedCategoryId', this._id) ? 'selected' : '';
    },

    datum: function () {
        return moment(this.datum).format('DD.MM.YYYY');
    },

    disabledProperty: function () {
        if (Session.get('bookingDeletedAlert')) {
            return '';
        } else {
            return '';
        }
    },

    isChecked: function () {
        return Bookings.findOne({_id: Session.get('selectedBookingId')}).fixExpenseId == undefined ? false : true;
    }
});
