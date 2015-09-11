/**
 * Created by Njoku on 25.08.2015.
 */

Meteor.methods({
    /* Bookings Part */

    createBooking: function (booking) {
        var bookingId = Bookings.insert(booking);
        return bookingId;
    },

    updateBooking: function (booking) {
        var affectedBookings = Bookings.update({_id: booking._id}, booking);
        return affectedBookings;
    },

    updateBookingsCategory: function (category) {
        var affectedBookings = Bookings.update({categoryId: category._id}, {$set: {category: category.name}}, {multi: true});
        return affectedBookings;
    },

    deleteBooking: function (id) {
        Bookings.remove({_id: id});
    },

    /* Categories Part */

    createCategory: function (category) {
        var categoryId = Categories.insert(category);
        return categoryId;
    },

    updateCategory: function (category) {
        var affectedCategories = Categories.update({_id: category._id}, category);
        return affectedCategories;
    },

    deleteCategory: function (id) {
        Categories.remove({_id: id});
    },

    /* Query Part */

    createOrUpdateStatisticQuery: function (query) {


        //var queryId = Queries.upsert("currentQuery", {$set: {query: query}});
        var queryId = Queries.upsert("currentQuery", {$set: {query: query}});
        return queryId;
    }
});
