/**
 * Created by Njoku on 17.06.2015.
 */

Template.CategoryNew.events({
    'click #submit_category': function (event, template) {
        event.preventDefault();

        var localCategory = {};
        // adding _id to the localCategory inside the client
        // By doing this, we no longer rely on the server result to get the categoryId
        localCategory._id = Random.id();
        localCategory.name = S($('#new_category_name').val()).collapseWhitespace().s;
        localCategory.description = S($('#new_category_description').val()).collapseWhitespace().s;

        Meteor.call('createCategory', localCategory, function (error) {
            if (error) {
                console.log('CreateCategory:', 'Error when inserting category.');
                Session.set('notification', {
                    caller_template: 'category_new',
                    type: 'Fehler: ',
                    text: 'Kategorie existiert bereits.'
                });
            } else {
                console.log('CreateCategory: Success when inserting category');
                Session.set('notification', {
                    caller_template: 'category_new',
                    type: 'Bestätigung: ',
                    text: 'Kategorie erfolgreich angelegt und gespeichert.'
                });
                resetFields(template, ['#new_category_name', '#new_category_description']);
            }
        });

        function resetFields(template, fieldnames) {
            _.each(fieldnames, function (element, index, list) {
                $(element).val('');
            });
        }
    },

    'focus': function (event, template) {
        event.preventDefault();
        Session.set('notification', undefined);
    }
});