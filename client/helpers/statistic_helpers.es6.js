/**
 * Created by marcnjoku on 15.07.15.
 */

Template.Statistic.onCreated(function () {
    Meteor.subscribe("bookings");
    Meteor.subscribe('amounts');

    Session.set('datePicker', undefined);

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

    amounts: function () {
        // Retrieve amounts and corresponding category for selected (or not selected) range and category
        var currentQuery = getQuery();
        var results = getAmountPerCategory(currentQuery);
        return results;
    },

    total: function () {
        //var amountPerCategory = AmountPerCategory.find(getQuery()).fetch();

        var currentQuery = getQuery();
        var amountPerCategory = getAmountPerCategory(currentQuery);
        var totalAmount = _.reduce(_.pluck(amountPerCategory, 'amount'), function (memo, num) {
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
    $('#search_statistic_von_datum').val(moment().startOf('month').format("DD.MM.YYYY"));
    datePicker.vonDatum = moment().startOf('month').toDate();
    Session.set('datePicker', datePicker);

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
        var selectedCategoryId = Session.get('datePicker').categoryId == undefined ? undefined : Categories.findOne(Session.get('datePicker').categoryId).name;

        var query = {};

        if (vonDatum != undefined && bisDatum == undefined && selectedCategoryId == undefined) {
            query = {datum: {$gte: vonDatum}};
            //query.vonDatum = vonDatum;
        }
        if (vonDatum == undefined && bisDatum != undefined && selectedCategoryId == undefined) {
            query = {datum: {$lte: bisDatum}};
            //query.bisDatum = bisDatum;
        }
        if (vonDatum != undefined && bisDatum == undefined && selectedCategoryId != undefined) {
            query = {$and: [{datum: {$gte: vonDatum}}, {category: selectedCategoryId}]};
            //query.vonDatum = vonDatum;
            //query.categoryId = selectedCategoryId;
        }
        if (vonDatum == undefined && bisDatum != undefined && selectedCategoryId != undefined) {
            query = {$and: [{datum: {$lte: bisDatum}}, {category: selectedCategoryId}]};
            //query.bisDatum = bisDatum;
            //query.categoryId = selectedCategoryId;
        }
        if (vonDatum == undefined && bisDatum == undefined && selectedCategoryId != undefined) {
            query = {category: selectedCategoryId};
            //query.categoryId = selectedCategoryId;
        }
        if (vonDatum != undefined && bisDatum != undefined && selectedCategoryId != undefined) {
            query = {$and: [{datum: {$gte: vonDatum}}, {datum: {$lte: bisDatum}}, {category: selectedCategoryId}]};
            //query.vonDatum = vonDatum;
            //query.bisDatum = bisDatum;
            //query.categoryId = selectedCategoryId;
        }
        if (vonDatum != undefined && bisDatum != undefined && selectedCategoryId == undefined) {
            query = {$and: [{datum: {$gte: vonDatum}}, {datum: {$lte: bisDatum}}]};
            //query.vonDatum = vonDatum;
            //query.bisDatum = bisDatum;
        }

        /*Meteor.call('createOrUpdateStatisticQuery', query, function (error, result) {
         if (error) {
         console.log('Queries:', error);
         } else {
         console.log('Queries:', result);
         }
         });*/

        return query;
    }
    //console.log('In getCurrentBookings: ' + vonDatum + ' ' + bisDatum);
}

function getAmountPerCategory(query) {
    var amountPerCategory = new Map();
    var bookingsList = [];
    var categoriesList = Categories.find().fetch();

    bookingsList = Bookings.find(query).fetch();

    var groupedBookings = _.groupBy(bookingsList, function (booking) {
        return booking.category;
    });

    // Bookings must exist in order to display any amount related statistics greater than 0.
    if (_.isEmpty(groupedBookings)) {
        _.each(categoriesList, function (element, index, list) {
            amountPerCategory.set(element.name, {category: element.name, amount: 0});
        });
    } else {
        _.each(bookingsList, function (element, index, list) {
            var accAmount = _.reduce(_.pluck(groupedBookings[element.category], 'amount'), function (memo, num) {
                return memo + num;
            }, 0);

            amountPerCategory.set(element.category, {category: element.category, amount: parseFloat(accAmount.toFixed(2))});
            //Categories.update({_id: element.categoryId}, {$set: {accumulatedAmount: parseFloat(accAmount.toFixed(2))}});
        });
        var diffList = _.difference(_.pluck(categoriesList, 'name'), _.pluck(bookingsList, 'category'));
        _.each(diffList, function (element, index, list) {
            amountPerCategory.set(element, {category: element, amount: 0});
            //Categories.update({_id: element}, {$set: {accumulatedAmount: 0}});
        });
    }
    return [...amountPerCategory.values()];
}