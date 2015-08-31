/**
 * Created by Njoku on 16.06.2015.
 */

Template.Statistic.events({
    'click a.searchForm': function (event, template) {
        var isf = !Session.get('isSearchForm').isSet;
        Session.set('isSearchForm', {
            isSet: isf,
            caller_template: 'statistic'
        });
    },

    'click #statistic_search': function (event, template) {
        event.preventDefault();

        var bDv = moment(template.find('#statistic_von_datum').value, 'DD-MM-YYYY');
        var eDv = moment(template.find('#statistic_bis_datum').value, 'DD-MM-YYYY');
        var currentCategory = template.find('#statistic_category').value;


        if (moment(bDv).isBefore(eDv)) {
            Session.set('dateOutOfRange', false);
            Session.set('timeSpecialRange', [bDv.toDate(), eDv.toDate()]);
            //ToDo
            //Categories.find({name: currentCategory}).fetch();
            var names = currentCategory;

            Session.set('someCategories', names);

            //ManipulateCategoriesAmounts.searchCategoriesAmounts(currentCategory, [bDv, eDv]);
            //ManipulateCategoriesAmounts.searchCategoriesAmounts(currentCategory, 'all');
            //ManipulateCategoriesAmounts.updateCategoriesByRange(currentCategory, [bDv, eDv]);
        } else {
            Session.set('dateOutOfRange', true);
        }
    },

    'change select': function (event, template) {
        event.preventDefault();

        var query_parameters = [];
        var beginDate = template.find('#statistic_von_datum').value;
        var endDate = template.find('#statistic_bis_datum').value;
        var category_name = template.find('#statistic_category').value;

        query_parameters.push(beginDate, endDate, category_name);

        Meteor.apply('getSomeCategoriesByNameAndRange', [query_parameters], function (error, categories) {
            if (error) {
                console.log('An error occured: ' + error.reason);
                return error.reason;
            }
            console.log('Some categories are ' + categories.length);
            Session.set('selectedCategories', categories);
        });

        var bDv = moment(beginDate, 'DD-MM-YYYY');
        var eDv = moment(endDate, 'DD-MM-YYYY');
        var currentCategory = template.find('#statistic_category').value;


        if (moment(bDv).isBefore(eDv)) {
            Session.set('dateOutOfRange', false);
            Session.set('timeSpecialRange', [bDv.toDate(), eDv.toDate()]);
            //ToDo
            //Categories.find({name: currentCategory}).fetch();
            var names = currentCategory;

            Session.set('someCategories', names);

            //ManipulateCategoriesAmounts.searchCategoriesAmounts(currentCategory, [bDv, eDv]);
            //ManipulateCategoriesAmounts.searchCategoriesAmounts(currentCategory, 'all');
            //ManipulateCategoriesAmounts.updateCategoriesByRange(currentCategory, [bDv, eDv]);
        } else {
            Session.set('dateOutOfRange', true);
        }


        //var category_name = template.find('#statistic_category').value;
        //console.log('The new selected category is = ' + category_name);

        //var names = category;
        //Session.set('oneCategory', category);

        //var name = Session.get('oneCategory');
        /*Meteor.call('getOneCategory', category_name, function (error, category) {
         if (error) {
         console.log('An error occured: ' + error.reason);
         return error.reason;
         }
         console.log('One category is ' + category.name);
         Session.set('oneCategory', category);
         });*/


        //Session.set('selectedCategory', category_name);
    },

    'focus': function (event, template) {
        event.preventDefault();
        // Session variable will be checked on false once a field gains focus.
        Session.set('bookingAddedAlert', false);
        Session.set('bookingGeneralAlert', false);
    }
});
