/**
 * Created by Njoku on 17.06.2015.
 */

Template.CategoryNew.events({
    'click #submit_category': function (event, template) {
        event.preventDefault();

        var localCategory = {};
        localCategory.name = S($('#new_category_name').val()).collapseWhitespace().s;
        localCategory.description = S($('#new_category_description').val()).collapseWhitespace().s;

        var id = Meteor.call('createCategory', localCategory, function (error, result) {
            console.log('Error:', error);
            console.log('Success:', result);
        });

        if (Categories.findOne({_id: id}) == undefined) {
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