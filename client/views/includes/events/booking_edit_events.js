/**
 * Created by Njoku on 16.06.2015.
 */

Template.BookingEdit.events({
    'click #save_booking': function (event, template) {
        event.preventDefault();

        if (template.data.booking === undefined) {
            // Session variable will be checked on true in "ifNoChangesCategory"-Template.
            Session.set('bookingUpdatingErrorAlert', true);
            return;
        }

        var bookingData = {};
        var bookingId = template.data.booking._id;
        bookingData.amount = S(template.find('#edit_booking_amount').value).replaceAll(',', '.').toFloat(2);
        bookingData.datum = template.find('#edit_booking_datum').value;
        bookingData.category = S(template.find('#edit_booking_category').value).collapseWhitespace().s;
        bookingData.remark = S(template.find('#edit_booking_remark').value).collapseWhitespace().s;

        var currentAmount = S(template.data.booking.amount).toFloat(2);
        var diffAmount = bookingData.amount - currentAmount;

        var diffDates = moment(bookingData.datum, 'DD-MM-YYYY').isSame(template.data.booking.datum, 'DD-MM-YYYY');

        if (diffAmount == 0 && diffDates
            && bookingData.category === template.data.booking.category && bookingData.remark === template.data.booking.remark) {
            // Session variable will be checked on true in "ifNoChangesCategory"-Template.
            Session.set('bookingNoChangesAlert', true);
            return;
        }

        var currentCategory = Categories.findOne({name: bookingData.category});

        var affectedBooking = Bookings.update({_id: bookingId}, {
            amount: bookingData.amount,
            datum: moment(bookingData.datum, 'DD-MM-YYYY').toDate(),
            categoryId: currentCategory._id,
            category: bookingData.category,
            remark: bookingData.remark
        }, function (error, ids) {
            if (error) {
                console.log('Error when updating booking!');
                Session.set('bookingUpdatingErrorAlert', true);
            } else {
                console.log('Success when updating ' + ids + ' bookings');
                // Update CategoriesAmount-Collection immediately.
                ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));

                // Session variable will be checked on true in "ifEditBooking"-Template. //
                Session.set('bookingUpdatedAlert', true);
            }
        });

        /*if (affectedBooking != undefined && affectedBooking != 0) {
            var currentAmount = Amounts.findOne({category_id: currentCategory._id});
            Amounts.update({_id: currentAmount._id}, {
                $inc: {amount: diffAmount}
            }, function (error, ids) {
                if (error) {
                    console.log('Error when updating amount... ' + error);
                    return;
                } else {
                    console.log('Success when updating amount with ID = ' + ids[0]);
                }
            });
        }*/
    },

    'click #delete_booking': function (event, template) {
        event.preventDefault();

        if (template.data.booking === undefined) {
            // Session variable will be checked on true in "ifNoChangesCategory"-Template.
            Session.set('bookingDeletedErrorAlert', true);
            return;
        }

        var bookingId = template.data.booking._id;



        var affectedBooking = Bookings.remove({_id: bookingId}, function (error) {
            if (error) {
                console.log('Error when deleting booking!');
                Session.set('bookingDeletedErrorAlert', true);
            } else {
                console.log('Success when removing booking with ID = ' + bookingId);
                // Update CategoriesAmount-Collection immediately.
                ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));
                // Session variable will be checked on true in "ifDeleteBooking"-Template.
                Session.set('bookingDeletedAlert', true);
                // Reset all input-fields
                ManipulateCategoriesAmounts.resetForm(template, ['#edit_booking_amount', '#edit_booking_datum', '#edit_booking_category', '#edit_booking_remark']);
            }
        });

        /*if (affectedBooking != undefined && affectedBooking != 0) {
            var currentCategory = Categories.findOne({name: template.data.booking.category});
            var currentAmount = Amounts.findOne({category_id: currentCategory._id});
            Amounts.update({_id: currentAmount._id}, {
                $inc: {amount: -template.data.booking.amount}
            }, function (error, ids) {
                if (error) {
                    console.log('Error when updating amount... ' + error);
                    return;
                } else {
                    console.log('Success when updating amount with ID = ' + ids[0]);
                }
            });
        }*/
    },

    'focus': function (event, template) {
        event.preventDefault();
        // Session variables will be checked on false once a field gains focus.
        Session.set('bookingNoChangesAlert', false);
        Session.set('bookingUpdatedAlert', false);
        Session.set('bookingUpdatingErrorAlert', false);
        Session.set('bookingDeletedAlert', false);
        Session.set('bookingDeletedErrorAlert', false);
    }
});
