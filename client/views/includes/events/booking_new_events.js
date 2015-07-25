/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingNew.events({
    'click #submit_booking': function (event, template) {
        event.preventDefault();

        var bookingData = {};
        bookingData.amount = S(template.find('#new_booking_amount').value).replaceAll(',', '.').toFloat(2);
        bookingData.datum = template.find('#new_booking_datum').value;
        bookingData.category = S(template.find('#new_booking_category').value).collapseWhitespace().s;
        bookingData.remark = S(template.find('#new_booking_remark').value).collapseWhitespace().s;

        var currentCategory = Categories.findOne({name: bookingData.category})

        var bookingId = Bookings.insert({
            amount: bookingData.amount,
            datum: moment(bookingData.datum, 'DD-MM-YYYY').toDate(),
            categoryId: currentCategory._id,
            category: bookingData.category,
            remark: bookingData.remark
        }, function (error, id) {
            if (error) {
                console.log('Error when inserting booking!');
                Session.set('bookingGeneralAlert', true);
            } else {
                console.log('Success when inserting booking with ID = ' + id);
                // Update CategoriesAmount-Collection immediately.
                ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));
                //ManipulateCategoriesAmounts.updateCategoriesByRange('all');
                // Session variable will be checked on true in "ifNewBooking"-Template.
                Session.set('bookingAddedAlert', true);
                // Reset all input-fields
                ManipulateCategoriesAmounts.resetForm(template, ['#new_booking_amount', '#new_booking_datum', '#new_booking_category', '#new_booking_remark']);
            }
        });


        /*if (bookingId != undefined) {
            var currentCategoryAmount = Amounts.findOne({category: bookingData.category});
            var currentBooking = Bookings.find({_id: bookingId}, {amount: 1, _id: 0}).fetch()[0];
            Amounts.update({_id: currentCategoryAmount._id}, {
                $inc: {amount: currentBooking.amount}
            }, function (error, ids) {
                if (error) {
                    console.log('Error when updating category amount!');
                    return;
                } else {
                    console.log('Success when updating ' + ids + ' category amount');
                }
            });
        }*/
    },

    'change select': function (event, template) {
        event.preventDefault();
        var category = template.find('#new_booking_category').value;
        console.log('The new selected category is = ' + category);
        Session.set('selectedCategory', category);
    },

    'focus': function (event, template) {
        event.preventDefault();
        // Session variable will be checked on false once a field gains focus.
        Session.set('bookingAddedAlert', false);
        Session.set('bookingGeneralAlert', false);
    }
});
