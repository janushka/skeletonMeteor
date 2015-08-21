/**
 * Created by marcnjoku on 15.07.15.
 */

Template.Statistic.rendered = function () {
    var picker1 = new Pikaday({
        field: document.getElementById('statistic_von_datum'),
        format: 'DD.MM.YYYY',
        onSelect: function () {
            console.log(this.getMoment().format('DD.MM.YYYY'));
        }
    });

    var picker2 = new Pikaday({
        field: document.getElementById('statistic_bis_datum'),
        format: 'DD.MM.YYYY',
        onSelect: function () {
            console.log(this.getMoment().format('DD.MM.YYYY'));
        }
    });

    var preselectedCategory = this.find('#statistic_category').value;
    Session.set('selectedCategory', preselectedCategory);
};

Template.Statistic.helpers({
    OneCategory: function() {
        var selected_category = Session.get('oneCategory');
        return selected_category;
    },

    Categories: function() {
        var selected_categories = Session.get('selectedCategories');
        return selected_categories;
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
