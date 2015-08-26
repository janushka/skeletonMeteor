Template.CategoryNew.onCreated(function () {
    Meteor.subscribe('categories');

    Session.set('notification', undefined);
});

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