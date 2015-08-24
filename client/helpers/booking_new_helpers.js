/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingNew.onCreated(function () {
    this.autorun(function () {
        if (Categories.find().count() == 0) {
            Session.set('notification', {
                caller_template: 'booking_new',
                type: 'Info: ',
                text: 'Kategorie(n) zuvor anlegen!'
            });
        } else {
            Session.set('notification', undefined);
        }
    });


});

Template.BookingNew.rendered = function () {
    var preSelectedCategory = $('#new_booking_category').val();
    if (preSelectedCategory != undefined) {
        console.log('Pre-Selected CategoryId', preSelectedCategory);
        Session.set('selectedCategoryId', {
            caller_template: 'booking_new',
            categoryId: preSelectedCategory
        });
    } else {
        Session.set('selectedCategoryId', undefined);
    }

    var picker = new Pikaday({
        field: document.getElementById('new_booking_datum'),
        format: 'DD.MM.YYYY',
        onSelect: function () {
            console.log(this.getMoment().format('DD.MM.YYYY'));
        }
    });

    if (Session.equals('notification', undefined)) {
        enableFields();
    } else {
        disableFields();
    }

    function enableFields() {
        $('#new_booking_datum').prop('disabled', false);
        $('#new_booking_amount').prop('disabled', false);
        $('#new_booking_category').prop('disabled', false);
        $('#new_booking_remark').prop('disabled', false);
        $('#submit_booking').prop('disabled', false);
    }

    function disableFields() {
        $('#new_booking_datum').prop('disabled', true);
        $('#new_booking_amount').prop('disabled', true);
        $('#new_booking_category').prop('disabled', true);
        $('#new_booking_remark').prop('disabled', true);
        $('#submit_booking').prop('disabled', true);
    }

    //var preselectedCategory = this.find('#new_booking_category').value;
    //Session.set('selectedCategory', preselectedCategory);

    //Session.set('categoryExistingAlert', false);
    //Session.set('categoryAddedAlert', false);
};

// If no category(ies) present, then disable booking-button and input-fields.
// Otherwise enable them all.
Template.BookingNew.helpers({
    categoryId: function () {
        return Categories.find({}, {
            fields: {
                name: 1,
                _id: 1
            }
        });
    },

    isSelected: function () {
        return Session.equals('selectedBookingId', this._id) ? 'selected' : '';
    },

    disabledProperty: function () {
        var categoriesCount = Categories.find().count();
        //if (categoriesCount === 0 || Session.get('bookingAddedAlert')) {
        if (categoriesCount === 0) {
            return 'disabled';
        } else {
            return '';
        }
    },
    bookingButtonDisabled: function () {
        var categoriesCount = Categories.find().count();
        if (Session.get('bookingAmountValid') || categoriesCount !== 0) {
            return '';
        } else {
            return 'disabled';
        }
    },
    currentCategory: function () {
        if (Session.get('selectedCategory')) {
            var selectedCategory = Categories.findOne({'name': Session.get('selectedCategory')});
            return selectedCategory;
        }
    }
});