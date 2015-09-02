/**
 * Created by Njoku on 16.06.2015.
 */

// Template Statistic

Template.Statistic.events({
    'click a.searchForm': function (event, template) {
        var isf = !Session.get('isSearchForm').isSet;
        Session.set('isSearchForm', {
            isSet: isf,
            caller_template: 'statistic'
        });
        Session.set('statisticSearchFormEnabled', isf);
    }
});


// Template searchFormBookingList

Template.searchFormStatistic.events({
    'click #search_statistic_von_datum': function (event, template) {
        console.log('Von angeklickt!');
    },

    'click #search_statistic_bis_datum': function (event, template) {
        console.log('Bis angeklickt!');
    },

    'change select': function (event, template) {
        event.preventDefault();
        var selectedCategoryId = $('#search_statistic_category').val() == 'all' ? undefined : $('#search_statistic_category').val();

        var datePicker = {};
        if (Session.get('datePicker') == undefined) {
            datePicker.categoryId = selectedCategoryId;
        } else {
            var datePicker = Session.get('datePicker');
            datePicker.categoryId = selectedCategoryId;
        }
        Session.set('datePicker', datePicker);
        console.log('Selected categoryId', selectedCategoryId);
    },
});
