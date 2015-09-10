/**
 * Created by Njoku on 20.08.2015.
 */

Meteor.publish("bookings", function () {
    return Bookings.find();
});

// TODO: will be uses later on!
Meteor.publish('limitedBookings', function (options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    console.log('The limit is: ' + options.limit);
    return Bookings.find({}, options);
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

Meteor.publish('amounts', function (query) {
    var subscription = this;
    var initiated = false;
    var currentTotal = {};

    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

    var pipeline = [
        {$match: {}},
        {$group: {_id: '$category', total_amount: {$sum: '$amount'}}}
    ];

    db.collection('bookings').aggregate(
        pipeline,
        Meteor.bindEnvironment(
            function (err, result) {
                console.log('Aggregation result', result);
                _.each(result, function (r) {
                    currentTotal.sum = r.total;
                    subscription.added('amountPerCategory', r._id, {
                        amount: r.total_amount
                    });
                });
            }
        )
    );

    var amountsHandle = AmountPerCategory
        .find()
        .observeChanges({
            added: function (id, fields) {
                if (!initiated) return;
                var currentID = fields.category;
                currentTotal.sum += fields.amount;
                console.log('Current ID', currentID);
                console.log('Current Total', currentTotal);
                subscription.changed('amountPerCategory', currentID, {amount: currentTotal.sum});
            }
        });

    initiated = true;
    subscription.onStop(function () {
        amountsHandle.stop();
    });

    subscription.ready();
});

Categories._ensureIndex({name: 1}, {unique: true});