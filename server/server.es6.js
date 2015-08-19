/**
 * Created by Njoku on 25.11.2014.
 */

Meteor.methods({
    testWaitOn: function () {
        console.log("Received data from the client: ", arguments)
        var rand = Math.random();
        console.log(rand);
        return rand;
    },

    getAuthors: function () {
        console.log("Received getAuthors request from the client:", arguments);
        return Authors.find().fetch();
    },

    getSomeAuthors: function (name) {
        console.log("Received getSomeAuthors request from the client:", name);
        return Authors.find({name: name}).fetch();
    },

    getAllBookings: function () {
        console.log("Received getAllBookings request from the client:", arguments);
        return Bookings.find().fetch();
    },

    getLimitedBookings: function () {
        console.log("Received getLimitedBookings request from the client:", arguments);
        return Bookings.find().fetch();
    },

    getAllCategories: function () {
        console.log("Received getAllCategories request from the client:", arguments);
        return Categories.find().fetch();
    },

    getOneCategory: function (category_name) {
        console.log("Received getOneCategory request from the client:", arguments);
        return Categories.find({name: category_name}).fetch();
    },

    getSomeCategories: function (category_names) {
        console.log("Received getSomeCategoriesByName request from the client:", category_names);
        console.log('Type = ' + typeof category_names);

        var categories;

        if (category_names.length == 1) {
            if (category_names[0] === 'all') {
                categories = Categories.find({}).fetch();
            } else {
                console.log('Selected Category: ' + category_names[0]);
                categories = Categories.find({name: category_names[0]}).fetch();
            }
        } else {
            var query = [];
            for (var i = 0; i < category_names.length; i++) {
                query.push({name: category_names[i]});
            }
            categories = Categories.find({$or: query}).fetch();
        }

        return categories;
    },

    getSomeCategoriesByNameAndRange: function (parameters) {
        console.log("Received getSomeCategoriesByNameAndRange request from the client:", parameters);
        console.log('Type = ' + typeof parameters);

        var beginDate = parameters[0];
        var endDate = parameters[1];
        var categories_names = [];
        var categories;

        for (var i = 2; i < parameters.length; i++) {
            categories_names.push(parameters[i]);
        }

        if (beginDate.length == 0 && endDate.length == 0) {
            if (categories_names.length == 1) {
                if (parameters[0] === 'all') {
                    categories = Categories.find({datum: {$gte: beginDate}}).fetch();
                } else {
                    categories = Categories.find({$and: [{datum: {$gte: beginDate}}, {name: categories_names[0]}]}).fetch();
                }
            } else {
                var query = [];
                for (var i = 0; i < categories_names.length; i++) {
                    query.push({name: categories_names[i]});
                }
                categories = Categories.find({$and: [{datum: {$gte: beginDate}}, {$or: query}]}).fetch();
            }
        }
        if (beginDate.length != 0 && endDate.length == 0) {
            if (categories_names.length == 1) {
                if (parameters[0] === 'all') {
                    categories = Categories.find({datum: {$lte: endDate}}).fetch();
                } else {
                    categories = Categories.find({$and: [{datum: {$lte: endDate}}, {name: categories_names[0]}]}).fetch();
                }
            } else {
                var query = [];
                for (var i = 0; i < categories_names.length; i++) {
                    query.push({name: categories_names[i]});
                }
                categories = Categories.find({$and: [{datum: {$lte: endDate}}, {$or: query}]}).fetch();
            }
        }
        if (beginDate.length != 0 && endDate.length != 0) {
            // Check if beginDate < endDate
            if (beginDate > endDate) {
                return false;
            }
            if (categories_names.length == 1) {
                if (parameters[0] === 'all') {
                    categories = Categories.find({$and: [{datum: {$gte: beginDate}}, {datum: {$lte: endDate}}]}).fetch();
                } else {
                    categories = Categories.find({$and: [{$and: [{datum: {$gte: beginDate}}, {datum: {$lte: endDate}}]}, {name: categories_names[0]}]}).fetch();
                }
            } else {
                var query = [];
                for (var i = 0; i < categories_names.length; i++) {
                    query.push({name: categories_names[i]});
                }
                categories = Categories.find({$and: [{$and: [{datum: {$gte: beginDate}}, {datum: {$lte: endDate}}]}, {$or: query}]}).fetch();
            }
        }

        return categories;
    }
});