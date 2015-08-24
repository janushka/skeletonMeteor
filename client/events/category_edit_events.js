/**
 * Created by Njoku on 17.06.2015.
 */

Template.CategoryEdit.events({
    'click #save_category': function (event, template) {
        event.preventDefault();

        var localCategory = {};
        localCategory._id = Session.get('selectedCategoryId').categoryId;
        localCategory.name = S($('#edit_category_name').val()).collapseWhitespace().s;
        localCategory.description = S($('#edit_category_description').val()).collapseWhitespace().s;

        var currentCategory = Categories.findOne({_id: localCategory._id});

        if (_.isEqual(localCategory, currentCategory)) {
            Session.set('notification', {
                caller_template: 'category_edit',
                type: 'Warnung: ',
                text: 'Keine Änderungen festgestellt. Speichern abgebrochen!'
            });
            return;
        }

        var affectedCategories = Categories.update({_id: localCategory._id}, localCategory, function (error, ids) {
            if (error) {
                console.log('Error when updating category!');
                Session.set('notification', {
                    caller_template: 'category_edit',
                    type: 'Fehler: ',
                    text: 'Kategorie existiert bereits.'
                });
            } else {
                console.log('Success when updating ' + ids + ' categories');
                // Update Booking-Collection immediately: category-name may have been altered.
                //Meteor.call('updateBookingsByCategory', localCategory.categoryId);
                Session.set('notification', {
                    caller_template: 'category_edit',
                    type: 'Bestätigung: ',
                    text: 'Kategorie erfolgreich gespeichert.'
                });
            }
        });
    },

    'click #delete_category': function (event, template) {
        event.preventDefault();

        var categoryId = Session.get('selectedCategoryId').categoryId;

        var dependentBookings = Bookings.find({categoryId: categoryId});
        if (dependentBookings.count() != 0) {
            Session.set('notification', {
                caller_template: 'category_edit',
                type: 'Fehler: ',
                text: 'Abhängige Buchungen zuerst, dann diese Kategorie löschen.'
            });
            return;
        }

        Session.set('notification', {
            caller_template: 'category_edit',
            type: 'Bestätigung: ',
            text: 'Kategorie erfolgreich gelöscht.'
        });

        console.log("You just deleted a category.");
    },

    'focus': function (event, template) {
        event.preventDefault();
        Session.set('notification', undefined);
    }
});