/**
 * Created by Njoku on 17.06.2015.
 */

Template.CategoryNew.events({
    'click #submit_category': function (event, template) {
        event.preventDefault();

        var categoryData = {};
        categoryData.name = S(template.find('#new_category_name').value).collapseWhitespace().s;
        categoryData.description = S(template.find('#new_category_description').value).collapseWhitespace().s;

        var categoryId = Categories.insert({
            name: categoryData.name,
            description: categoryData.description,
            accumulatedAmount: 0
        }, function (error, id) {
            if (error) {
                console.log('Error when inserting category!');
                Session.set('categoryExistingAlert', true);
                return;
            } else {
                Session.set('categoryAddedAlert', true);
                console.log('Success when inserting category with ID = ' + id);
                // Session variable will be checked on true in "ifNewCategory"-Template.
                // Reset all input-fields
                ManipulateCategoriesAmounts.resetForm(template, ['#new_category_name', '#new_category_description']);
            }
        });

        /*if (categoryId != undefined) {
            Amounts.insert({
                category: categoryData.name,
                category_id: categoryId,
                amount: 0
            }, function (error, id) {
                if (error) {
                    console.log('Error when inserting amount!');
                    return;
                } else {
                    console.log('Success when inserting amount with ID = ' + id);
                }
            });
        }*/
    },

    'click #close_category_alert': function (event, template) {
        event.preventDefault();
        Session.set('categoriesAlert', true);
    },

    'focus': function (event, template) {
        event.preventDefault();
        // Session variables will be checked on false once a field gains focus.
        Session.set('categoryExistingAlert', false);
        Session.set('categoryAddedAlert', false);
    }
});