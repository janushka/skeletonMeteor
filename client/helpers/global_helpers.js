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

Template.registerHelper('isSearchFormConcerned', function (callerTemplate) {
    var temp = Session.get('isSearchForm');
    if (Session.get('isSearchForm') != undefined && Session.get('isSearchForm').caller_template == callerTemplate) {
        return true;
    }
    return false;
});

Template.registerHelper('searchFormEnabled', function () {
    if (Session.get('isSearchForm').isSet) {
        return true;
    }
    return false;
});

Template.registerHelper('searchFormEnabler', function () {
    if (Session.get('isSearchForm') && Session.get('isSearchForm').isSet) {
        return '[zu*]';
    } else {
        return '[auf*]';
    }
});


