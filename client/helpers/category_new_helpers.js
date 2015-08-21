Template.CategoryNew.onCreated(function () {
    Session.set('notification', undefined);
});

Template.CategoryNew.rendered = function () {
    //Session.set('categoryExistingAlert', false);
    //Session.set('categoryAddedAlert', false);
};

// Disable category save-button as long as the Alert is not closed.
Template.CategoryNew.helpers({
    disabledProperty: function () {
        if (Session.get('categoryAddedAlert')) {
            //return 'disabled';
            return '';
        } else {
            return '';
        }
    },

    categoryId: function () {
        return Categories.find({}, {
            fields: {
                name: 1,
                _id: 1
            }
        });
    },

    savingCategoryButtonDisabled: function () {
        if (Session.get('categoryNameValid')) {
            return '';
        } else {
            return 'disabled';
        }
    }
});

// Sub included helpers

Template.CategoryNew.ifNewCategory.helpers({
    isPresent: function () {
        if (Session.get('categoryAddedAlert')) {
            return true;
        } else {
            return false;
        }
    }
});