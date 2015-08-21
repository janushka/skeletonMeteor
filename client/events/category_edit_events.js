/**
 * Created by Njoku on 17.06.2015.
 */

Template.CategoryEdit.events({
    'click #save_category': function (event, template) {
        event.preventDefault();

        var categoryData = {};
        categoryData.categoryId = template.data.category._id;
        categoryData.name = S(template.find('#edit_category_name').value).collapseWhitespace().s;
        categoryData.description = S(template.find('#edit_category_description').value).collapseWhitespace().s;

        if (categoryData.name === template.data.category.name && categoryData.description === template.data.category.description) {
            // Session variable will be checked on true in "ifNoChangesCategory"-Template.
            Session.set('categoryNoChangesAlert', true);
            return;
        }

        var affectedCategories = Categories.update({_id: categoryData.categoryId}, {
            name: categoryData.name,
            description: categoryData.description
        }, function (error, ids) {
            if (error) {
                console.log('Error when updating category!');
                Session.set('categoryExistingAlert', true);
                return;
            } else {
                console.log('Success when updating ' + ids + ' categories');
                // Update CategoriesAmount-Collection immediately.
                ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));

                // Update Booking-Collection immediately: category-name may have been altered.
                Meteor.call('updateBookingsByCategory', categoryData.categoryId);
                // Session variable will be checked on true in "ifEditCategory"-Template.
                Session.set('categoryUpdatedAlert', true);
                // Reset all input-fields
                //ManipulateCategoriesAmounts.resetForm(template, ['#new_category_name', '#new_category_description']);
            }
        });

        /*if (affectedCategories != undefined && affectedCategories != 0) {
            var currentAmount = Amounts.findOne({category_id: categoryData.categoryId});
            Amounts.update({_id: currentAmount._id}, {
                $set: {category: categoryData.name}
            }, function (error, id) {
                if (error) {
                    console.log('Error when updating amount!');
                    return;
                } else {
                    console.log('Success when updating amount with ID = ' + id);
                }
            });
        }*/
    },

    'click #delete_category': function (event, template) {
        event.preventDefault();

        var categoryId = template.data.category._id;

        var dependentBookings = Bookings.find({categoryId: categoryId});
        if (dependentBookings.count() !== 0) {
            Session.set('dependentBookingsAlert', true);
            return;
        }

        var deleteResult = Categories.remove({_id: categoryId});

        /*if (deleteResult != undefined && deleteResult == 1) {
            var currentAmount = Amounts.findOne({category_id: categoryId});
            Amounts.remove({
                _id: currentAmount._id
            }, function (error, ids) {
                if (error) {
                    console.log('Error when deleting amount!');
                    return;
                } else {
                    console.log('Success when deleting amount with ID = ' + ids[0]);
                }
            });
        }*/

        // Update CategoriesAmount-Collection immediately.
        ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));

        Session.set('selectedCategory', undefined);

        // Session variable will be checked on true in "ifDeleteCategory"-Template.
        Session.set('categoryDeletedAlert', true);

        // Reset all input-fields
        ManipulateCategoriesAmounts.resetForm(template, ['#edit_category_name', '#edit_category_description']);

        console.log("You just deleted a category.");
    },

    'focus': function (event, template) {
        event.preventDefault();
        // Session variable will be checked on false once a field gains focus.
        Session.set('categoryNoChangesAlert', false);
        Session.set('categoryExistingAlert', false);
        Session.set('categoryUpdatedAlert', false);
        Session.set('dependentBookingsAlert', false);
    }
});