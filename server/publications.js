/**
 * Created by Njoku on 20.08.2015.
 */

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

Meteor.publish('limitedBookings', function (options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    //console.log('The sorting order is: ' + options.sort);
    console.log('The limit is: ' + options.limit);
    return Bookings.find({}, options);
});

Meteor.publish('amounts', function () {
    var subscription = this;
    var initiated = false;
    var currentTotal = {};

    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

    var pipeline = [
        {$match: {name: 'MacBookair'}},
        {$group: {_id: '$type', total: {$sum: '$price'}}}
    ];

    db.collection('bookings').aggregate(
        pipeline,
        Meteor.bindEnvironment(
            function (err, result) {
                console.log('Aggregation result', result);
                _.each(result, function (r) {
                    currentTotal.sum = r.total;
                    subscription.added('numberOfMBA', r._id, {
                        number: r.total
                    });
                })
            }
        )
    );

    var computerHandle = Bookings
        .find()
        .observeChanges({
            added: function (id, fields) {
                if (!initiated) return;
                var currentID = fields.type;
                currentTotal.sum += fields.price;
                console.log('Current ID', currentID);
                console.log('Current Total', currentTotal);
                subscription.changed('numberOfMBA', currentID, {number: currentTotal.sum});
            }
        });

    initiated = true;
    subscription.onStop(function () {
        computerHandle.stop();
    });

    subscription.ready();
});

Categories._ensureIndex({name: 1}, {unique: true});
Amounts._ensureIndex({category: 1}, {unique: true});
