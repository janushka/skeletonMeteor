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

        Meteor.call('updateCategory', localCategory, function (error) {
            if (error) {
                console.log('UpdateCategory:', error);
                Session.set('notification', {
                    caller_template: 'category_edit',
                    type: 'Fehler: ',
                    text: 'Kategorie existiert bereits.'
                });
            } else {
                Meteor.call('updateBookingsCategory', localCategory, function (error) {
                    if (error) {
                        console.log('UpdateCategory:', error);
                        Session.set('notification', {
                            caller_template: 'category_edit',
                            type: 'Fehler: ',
                            text: 'Kategorie abhängige Buchungen nicht änderbar.'
                        });
                    } else {
                        console.log('UpdateCategory: Success when updating category(ies)');
                        console.log('UpdateCategory: Success when updating dependent booking(s).');
                        Session.set('notification', {
                            caller_template: 'category_edit',
                            type: 'Bestätigung: ',
                            text: 'Kategorie (und eventuell abhängigen Buchungen) erfolgreich gespeichert.'
                        });
                    }
                });
            }
        });

        Meteor.call('updateBookingsCategory', localCategory, function (error, result) {
            if (error) {
                console.log('UpdateCategory:', error);
            } else {
                console.log('UpdateCategory: Success when updating dependent booking(s).');
            }
        });
    },

    'click #delete_category': function (event, template) {
        event.preventDefault();

        var dependentBookings = Bookings.find({categoryId: Session.get('selectedCategoryId').categoryId});
        if (dependentBookings.count() != 0) {
            Session.set('notification', {
                caller_template: 'category_edit',
                type: 'Fehler: ',
                text: 'Abhängige Buchungen zuerst, dann diese Kategorie löschen.'
            });
            return;
        }

        Meteor.call('deleteCategory', Session.get('selectedCategoryId').categoryId, function (error) {
            if (error) {
                console.log('DeleteCategory:', error);
            } else {
                console.log('DeleteCategory: Success when deleting category with Id', Session.get('selectedCategoryId').categoryId);
                Session.set('notification', {
                    caller_template: 'category_edit',
                    type: 'Bestätigung: ',
                    text: 'Kategorie erfolgreich gelöscht.'
                });
            }
        });
    },

    'focus': function (event, template) {
        event.preventDefault();
        Session.set('notification', undefined);
    }
});