// Disable category save-button as long as the Alert is not closed.
Template.CategoryEdit.helpers({
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