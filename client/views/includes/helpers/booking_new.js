/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingNew.rendered = function () {
    var picker = new Pikaday({
        field: document.getElementById('new_booking_datum'),
        format: 'DD.MM.YYYY',
        onSelect: function () {
            console.log(this.getMoment().format('DD.MM.YYYY'));
        }
    });

    var preselectedCategory = this.find('#new_booking_category').value;
    Session.set('selectedCategory', preselectedCategory);

    Session.set('categoryExistingAlert', false);
    Session.set('categoryAddedAlert', false);
};

// If no category(ies) present, then disable booking-button and input-fields.
// Otherwise enable them all.
Template.BookingNew.helpers({
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