/**
 * Created by Njoku on 25.11.2014.
 */

Meteor.methods({
    updateBookingsByCategory: function(categoryId) {
        var updatedCategory = Categories.findOne({_id: categoryId});
        Bookings.update({categoryId: updatedCategory._id}, {$set: {category: updatedCategory.name}}, {multi: true});
    }
});
