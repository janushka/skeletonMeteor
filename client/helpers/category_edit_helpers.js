Template.CategoryEdit.onCreated(function () {
    if (Session.equals('selectedCategoryId', undefined)) {
        Session.set('notification', {
            caller_template: 'category_edit',
            type: 'Fehler: ',
            text: 'Keine Kategorie ausgewählt!'
        });
    } else {
        Session.set('notification', undefined);
    }
});

Template.CategoryEdit.helpers({
    category: function () {
        if (Session.get('selectedCategoryId') != undefined) {
            return Categories.findOne({_id: Session.get('selectedCategoryId').categoryId});
        }
    },

    disabledProperty: function () {
        if (Session.get('categoryDeletedAlert')) {
            return 'disabled';
        } else {
            return '';
        }
    },
    savingAndDeleteButtonDisabled: function () {
        if (Session.get('categoryNameValid')) {
            return '';
        } else {
            return 'disabled';
        }
    }
});