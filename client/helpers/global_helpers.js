/**
 * Created by Njoku on 21.08.2015.
 */

Template.registerHelper('isConcerned', function (callerTemplate) {
    if (Session.get('notification') != undefined && Session.get('notification').caller_template == callerTemplate) {
        return true;
    }
    return false;
});

Template.registerHelper('isCategorySelected', function (callerTemplate) {
    if (Session.get('selectedCategoryId') != undefined && Session.get('selectedCategoryId').caller_template == callerTemplate) {
        return true;
    }
    return false;
});

Template.registerHelper('categorySelected', function (callerTemplate) {
    if (Session.get('selectedCategoryId').caller_template == callerTemplate) {
        return Categories.findOne({_id: Session.get('selectedCategoryId')});
    }
});

Template.registerHelper('notification', function () {
    return Session.get('notification');
});
