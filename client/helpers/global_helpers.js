/**
 * Created by Njoku on 21.08.2015.
 */

Template.registerHelper('isConcerned', function (callerTemplate) {
    if (Session.get('notification') != undefined && Session.get('notification').caller_template == callerTemplate) {
        return true;
    }
    return false;
});

Template.registerHelper('notification', function () {
    return Session.get('notification');
});
