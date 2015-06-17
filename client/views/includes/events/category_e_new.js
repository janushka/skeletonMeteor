/**
 * Created by Njoku on 17.06.2015.
 */

Template.CategoryNew.events({
    'click #submit_category': function (event, template) {
        event.preventDefault();

        var categoryData = {};
        categoryData.name = S(template.find('#new_category_name').value).collapseWhitespace().s;
        categoryData.description = S(template.find('#new_category_description').value).collapseWhitespace().s;

        Categories.insert({
            name: categoryData.name,
            description: categoryData.description,
            accumulatedAmount: 0
        });

        // Session variable will be checked on true in "ifNewCategory"-Template.
        Session.set('categoryAddedAlert', true);

        // Reset all input-fields
        ManipulateCategoriesAmounts.resetForm(template, ['#new_category_name', '#new_category_description']);
    },

    'click #edit_category': function (event, template) {
        var category = template.find('#new_booking_category').value;
        Session.set('selectedCategory', category);
    },

    'click #close_category_alert': function (event, template) {
        event.preventDefault();
        Session.set('categoriesAlert', true);
    },

    'focus': function (event, template) {
        event.preventDefault();
        // Session variable will be checked on false once a field gains focus.
        Session.set('categoryAddedAlert', false);
    }
});
