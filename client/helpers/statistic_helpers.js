/**
 * Created by marcnjoku on 15.07.15.
 */

Template.Statistic.onCreated(function () {
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
            caller_template: 'statistic'
        });
    } else {
        Session.set('isSearchForm', {
            isSet: Session.get('statisticSearchFormEnabled') == undefined ? false : Session.get('statisticSearchFormEnabled'),
            caller_template: 'statistic'
        });
    }
});

Template.Statistic.helpers({
    bookingsExist: function () {
        return Session.get('bookingsExist');
    },

    total: function () {
        /*var amountList = Amounts.find({}).fetch();
         var totalAmount = _.reduce(_.pluck(amountList, 'amount'), function (memo, num) {
         return memo + num;
         }, 0);*/

        var categoriesList = Categories.find().fetch();
        var totalAmount = _.reduce(_.pluck(categoriesList, 'accumulatedAmount'), function (memo, num) {
            return memo + num;
        }, 0);

        totalAmount = S(totalAmount).toFloat(2);
        return S(totalAmount).replaceAll('.', ',');
    }
});

// Template searchFormBookingList

Template.searchFormStatistic.onCreated(function () {
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
            caller_template: 'statistic'
        });
    }
});

Template.searchFormStatistic.rendered = function () {
    var datePicker = {};
    var pickerVon = new Pikaday({
        field: document.getElementById('search_statistic_von_datum'),
        format: 'DD.MM.YYYY',
        onSelect: function () {
        },
        onClose: function () {
            if (moment(this.getMoment()).isValid()) {
                datePicker.vonDatum = this.getMoment().toDate();
                datePicker.categoryId = $('#search_statistic_category').val() == 'all' ? undefined : $('#search_statistic_category').val();
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
        field: document.getElementById('search_statistic_bis_datum'),
        format: 'DD.MM.YYYY',
        onSelect: function () {
        },
        onClose: function () {
            if (moment(this.getMoment()).isValid()) {
                datePicker.bisDatum = this.getMoment().toDate();
                datePicker.categoryId = $('#search_statistic_category').val() == 'all' ? undefined : $('#search_statistic_category').val();
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

Template.searchFormStatistic.helpers({
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
                caller_template: 'statistic',
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