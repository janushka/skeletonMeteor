/**
 * Created by Njoku on 08.10.2014.
 */

Bookings = new Meteor.Collection("bookings");
Categories = new Meteor.Collection("categories");
Amounts = new Meteor.Collection("amounts");


if (Meteor.isClient) {
    console.log('In the Client!');
}

if (Meteor.isServer) {
    Meteor.publish("bookings", function () {
        return Bookings.find();
    });
    Meteor.publish("categories", function () {
        return Categories.find();
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
}

//Meteor.AppCache.config({onlineOnly: ['/fonts/']});

