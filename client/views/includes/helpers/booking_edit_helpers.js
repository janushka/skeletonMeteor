/**
 * Created by Njoku on 24.06.2015.
 */

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
    datum: function() {
        return moment(this.datum).format('DD.MM.YYYY');
    }
});
