/**
 * Created by Njoku on 16.06.2015.
 */

Template.Statistic.events({
    'click #statistic_search': function (event, template) {
        event.preventDefault();

        var bDv = moment(template.find('#statistic_von_datum').value, 'DD-MM-YYYY');
        var eDv = moment(template.find('#statistic_bis_datum').value, 'DD-MM-YYYY');
        var currentCategory = template.find('#statistic_category').value

        if (moment(bDv).isBefore(eDv)) {
            Session.set('dateOutOfRange', false);
            Session.set('timeSpecialRange', [bDv.toDate(), eDv.toDate()]);
            //ToDo
            ManipulateCategoriesAmounts.updateCategoriesByRange([bDv, eDv]);
        } else {
            Session.set('dateOutOfRange', true);
        }
    },

    'change select': function (event, template) {
        event.preventDefault();
        var category = template.find('#statistic_category').value;
        console.log('The new selected category is = ' + category);
        Session.set('selectedCategory', category);
    },

    'focus': function (event, template) {
        event.preventDefault();
        // Session variable will be checked on false once a field gains focus.
        Session.set('bookingAddedAlert', false);
        Session.set('bookingGeneralAlert', false);
    }
});
