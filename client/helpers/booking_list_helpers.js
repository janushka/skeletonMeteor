/**
 * Created by Njoku on 16.06.2015.
 */

// Template BookingList

Template.BookingList.onCreated(function () {
    Meteor.subscribe("bookings");

    this.autorun(function () {
        if (Bookings.find().count() == 0) {
            Session.set('notification', {
                caller_template: 'booking_list',
                type: 'Info: ',
                text: 'Derzeit keine Buchung(en) im System!'
            });
            Session.set('bookingsExist', false);
        } else {
            Session.set('notification', undefined);
            Session.set('bookingsExist', true);
        }
    });

    if (Session.equals('isSearchForm', undefined)) {
        Session.set('isSearchForm', {
            isSet: false,
            caller_template: 'booking_list'
        });
    } else {
        Session.set('isSearchForm', {
            isSet: Session.get('bookingListSearchFormEnabled') == undefined ? false : Session.get('bookingListSearchFormEnabled'),
            caller_template: 'booking_list'
        });
    }
});

Template.BookingList.helpers({
    bookingsExist: function () {
        return Session.get('bookingsExist');
    },

    bookings: function () {
        // Retrieve bookings for selected (or not selected) range and category
        //var currentQuery = getQuery();
        var results = Bookings.find(getQuery());
        return results;
    },

    datum: function () {
        var d = moment(this.datum).format('DD.MM.YYYY');
        return d;
    },

    amount: function () {
        var amountFormatted = S(this.amount).replaceAll('.', ',');
        return amountFormatted;
    },

    categoryTitle: function () {
        if (Session.get('bookingListByCategory') === undefined || Session.get('bookingListByCategory') === 'all') {
            return ''
        }
        return '(' + Session.get('bookingListByCategory') + ')';
    },

    nextPath: function () {
        if (Session.get('loadMoreBookings')) {
            var path = Session.get('bookingsLimit') + 5;
            return path;
        }
    }
});

// Template searchFormBookingList

Template.searchFormBookingList.onCreated(function () {
    Meteor.subscribe("categories");

    Session.set('datePicker', undefined);

    this.autorun(function () {
        if (Session.get('datePicker') == undefined) {
            Session.set('notification', undefined);
        } else {
            var valid = validateInputDates();
        }
    });

    if (Session.equals('isSearchForm', undefined)) {
        Session.set('isSearchForm', {
            isSet: false,
            caller_template: 'booking_list'
        });
    }

    this.testReactive = new ReactiveVar();
    this.testReactive.set('Start text.');
});

Template.searchFormBookingList.rendered = function () {
    var datePicker = {};
    var pickerVon = new Pikaday({
        field: document.getElementById('search_booking_list_von_datum'),
        format: 'DD.MM.YYYY',
        onSelect: function () {
        },
        onClose: function () {
            if (moment(this.getMoment()).isValid()) {
                datePicker.vonDatum = this.getMoment().toDate();
                datePicker.categoryId = $('#search_booking_list_category').val() == 'all' ? undefined : $('#search_booking_list_category').val();
                Session.set('datePicker', datePicker);
            } else {
                datePicker.vonDatum = undefined;
                datePicker.categoryId = undefined;
                Session.set('datePicker', datePicker);
            }
            console.log('Closed', moment(this.getMoment()).isValid());
        }
    });

    var pickerBis = new Pikaday({
        field: document.getElementById('search_booking_list_bis_datum'),
        format: 'DD.MM.YYYY',
        onSelect: function () {
        },
        onClose: function () {
            if (moment(this.getMoment()).isValid()) {
                datePicker.bisDatum = this.getMoment().toDate();
                datePicker.categoryId = $('#search_booking_list_category').val() == 'all' ? undefined : $('#search_booking_list_category').val();
                Session.set('datePicker', datePicker);
            } else {
                datePicker.bisDatum = undefined;
                datePicker.categoryId = undefined;
                Session.set('datePicker', datePicker);
            }
            console.log('Closed', moment(this.getMoment()).isValid());
        }
    });


};

Template.searchFormBookingList.helpers({
    categoryId: function () {
        return Categories.find({}, {
            fields: {
                name: 1,
                _id: 1
            }
        });
    }
});

function validateInputDates() {
    if (Session.get('datePicker').vonDatum != undefined && Session.get('datePicker').bisDatum != undefined) {
        if (moment(Session.get('datePicker').vonDatum).isAfter(Session.get('datePicker').bisDatum)) {
            Session.set('notification', {
                caller_template: 'booking_list',
                type: 'Fehler: ',
                text: 'Von- muss kleiner als Bis-Datum sein!'
            });
            return false;
        } else {
            Session.set('notification', undefined);
        }
    }
    else {
        Session.set('notification', undefined);
    }
    return true;
}

function getQuery() {
    if (Session.get('datePicker') == undefined) {
        return {};
    } else {
        var vonDatum = Session.get('datePicker').vonDatum;
        var bisDatum = Session.get('datePicker').bisDatum;
        var selectedCategoryId = Session.get('datePicker').categoryId;

        var query = {};

        if (vonDatum != undefined && bisDatum == undefined && selectedCategoryId == undefined) {
            query = {datum: {$gte: vonDatum}};
        }
        if (vonDatum == undefined && bisDatum != undefined && selectedCategoryId == undefined) {
            query = {datum: {$lte: bisDatum}};
        }
        if (vonDatum != undefined && bisDatum == undefined && selectedCategoryId != undefined) {
            query = {$and: [{datum: {$gte: vonDatum}}, {categoryId: selectedCategoryId}]};
        }
        if (vonDatum == undefined && bisDatum != undefined && selectedCategoryId != undefined) {
            query = {$and: [{datum: {$lte: bisDatum}}, {categoryId: selectedCategoryId}]};
        }
        if (vonDatum == undefined && bisDatum == undefined && selectedCategoryId != undefined) {
            query = {categoryId: selectedCategoryId};
        }
        if (vonDatum != undefined && bisDatum != undefined && selectedCategoryId != undefined) {
            query = {$and: [{datum: {$gte: vonDatum}}, {datum: {$lte: bisDatum}}, {categoryId: selectedCategoryId}]};
        }
        if (vonDatum != undefined && bisDatum != undefined && selectedCategoryId == undefined) {
            query = {$and: [{datum: {$gte: vonDatum}}, {datum: {$lte: bisDatum}}]};
        }

        return query;
    }
    //console.log('In getCurrentBookings: ' + vonDatum + ' ' + bisDatum);
}