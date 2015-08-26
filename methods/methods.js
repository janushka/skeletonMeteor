/**
 * Created by Njoku on 25.08.2015.
 */

Meteor.methods({
    /* Bookings Part */

    createBooking: function (booking) {
        return Bookings.insert(booking, function (error, id) {
            if (error) {
                if (Meteor.isServer) {
                    console.log('Error when inserting booking.');
                }
            } else {
                if (Meteor.isServer) {
                    console.log('Success when inserting ' + id + ' booking.');
                }
            }
        });
    },

    updateBooking: function (booking) {
        Bookings.update({_id: booking._id}, booking, function (error, ids) {
            if (error) {
                if (Meteor.isServer) {
                    console.log('Error when updating booking!');
                }
                return new Meteor.Error('Error when updating booking!');
            } else {
                if (Meteor.isServer) {
                    console.log('Success when updating ' + ids + ' booking(s)');
                }
            }
        });
    },

    updateBookingsCategory: function (category) {
        Bookings.update({categoryId: category._id}, {$set: {category: category.name}}, function (error, ids) {
            if (error) {
                if (Meteor.isServer) {
                    console.log('Error when updating dependent bookings.');
                }
                return new Meteor.Error('Kategorie abhängige Buchungen konnten nicht aktualisiert werden.');
            } else {
                if (Meteor.isServer) {
                    console.log('Success when updating ' + ids + ' dependent booking(s)');
                }
            }
        });
    },

    deleteBooking: function (id) {
        Bookings.remove({_id: id}, function (error, ids) {
            if (error) {
                if (Meteor.isServer) {
                    console.log('Error when deleting booking.');
                }
                return new Meteor.Error('Buchung konnte nicht gelöscht werden.');
            } else {
                if (Meteor.isServer) {
                    console.log('Success when deleting ' + ids + ' booking');
                }
            }
        });
    },

    /* Categories Part */

    createCategory: function (category) {
        return Categories.insert(category, function (error, id) {
            if (error) {
                if (Meteor.isServer) {
                    console.log('Error when inserting category.');
                }
                return new Meteor.Error('Error when inserting category.');
            } else {
                if (Meteor.isServer) {
                    console.log('Success when inserting ' + id + ' category.');
                }
                return id;
            }
        });
    },

    updateCategory: function (category) {
        Categories.update({_id: category._id}, category, function (error, ids) {
            if (error) {
                if (Meteor.isServer) {
                    console.log('Error when updating category!');
                }
                return new Meteor.Error('Error when updating category!');
            } else {
                if (Meteor.isServer) {
                    console.log('Success when updating ' + ids + ' category(ies)');
                }
            }
        });
    },

    deleteCategory: function (id) {
        Categories.remove({_id: id}, function (error, ids) {
            if (error) {
                if (Meteor.isServer) {
                    console.log('Error when deleting category.');
                }
                return new Meteor.Error('Kategorie konnte nicht gelöscht werden.');
            } else {
                if (Meteor.isServer) {
                    console.log('Success when deleting ' + ids + ' dependent category');
                }
            }
        });
    }
});
