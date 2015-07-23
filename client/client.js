/**
 * Created by marcnjoku on 02.11.14.
 */

Meteor.startup(function () {
    var categoriesLoaded = false;
    Meteor.subscribe("categories", function () {
        // at this point all new categories sent down are legitimately new ones
        categoriesLoaded = true;
    });
    var bookingsLoaded = false;
    Meteor.subscribe("bookings", function () {
        // at this point all new bookings sent down are legitimately new ones
        bookingsLoaded = true;
    });
    var amountsLoaded = false;
    Meteor.subscribe("amounts", function () {
        // at this point all new bookings sent down are legitimately new ones
        amountsLoaded = true;
    });

    var bookingsCursor = Bookings.find();
    var categoryCursor = Categories.find();
    var amountCursor = Amounts.find();

    var bookingsHandle = bookingsCursor.observe({
        added: function (booking) {
            // After reloading the page (especially the statistic-region), the former selected range
            // should be kept. If the Session is new, the default-range will be 'day'.
            ManipulateCategoriesAmounts.updateCategoriesByRange('day');
            if (bookingsLoaded) {
                console.log("A Booking has been added: " + booking.remark);
                ManipulateCategoriesAmounts.updateCategory(booking);
            }
        },
        removed: function (document) {
            console.log("A Booking has been removed.");
        }
    });

    var categoriesHandle = categoryCursor.observe({
        added: function (category) {
            if (categoriesLoaded) {
                console.log("A new Category has been added: " + category.name);
            }
        },
        removed: function (document) {
            console.log("A Category has been removed.");
        }
    });

    var amountsHandle = amountCursor.observe({
        added: function (amount) {
            if (amountsLoaded) {
                console.log("A new amount " + amount.amount + " for category " + amount.category + "has been added.");
            }
        },
        removed: function (document) {
            console.log("A category and it's amount has been removed.");
        }
    });

});
