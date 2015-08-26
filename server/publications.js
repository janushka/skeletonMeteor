/**
 * Created by Njoku on 20.08.2015.
 */

Meteor.publish("authors", function () {
    return Authors.find();
});

Meteor.publish("bookings", function () {
    return Bookings.find();
});

Meteor.publish("categories", function () {
    return Categories.find({}, {sort: {name: 1}});
});

Meteor.publish('limitedCategories', function (categoriesNames) {
    var params = [];
    for (var i = 0; i < categoriesNames.length; i++) {
        params.push({name: categoriesNames[i]});
    }
    var categories = Categories.find({$or: params});

    return categories;
});

Meteor.publish("amounts", function () {
    return Amounts.find();
});


Meteor.publish('limitedBookings', function (options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    //console.log('The sorting order is: ' + options.sort);
    console.log('The limit is: ' + options.limit);
    return Bookings.find({}, options);
});

Categories._ensureIndex({name: 1}, {unique: true});
Amounts._ensureIndex({category: 1}, {unique: true});
