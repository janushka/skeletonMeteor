/**
 * Created by Njoku on 06.10.2014.
 */

Meteor.startup(function () {
        console.log('Server was successfully initialized...');

        var currentMonth = moment().startOf('month').toDate();
        var beforeMonth = moment().subtract(1, 'month').startOf('month').toDate();
        var fixedExpenses = Bookings.find({$and: [{datum: {$gte: beforeMonth}}, {datum: {$lt: currentMonth}}, {fixExpenseId: {$exists: true}}]}).fetch();

        for (var k in fixedExpenses) {
            if (Bookings.find({$and: [{datum: {$gte: currentMonth}}, {fixExpenseId: fixedExpenses[k].fixExpenseId}]}).count() == 0) {
                var localBooking = {};
                localBooking.amount = fixedExpenses[k].amount;
                localBooking.datum = currentMonth;
                localBooking.category = fixedExpenses[k].category;
                localBooking.categoryId = fixedExpenses[k].categoryId;
                localBooking.remark = fixedExpenses[k].remark;
                localBooking.fixExpenseId = fixedExpenses[k].fixExpenseId;

                Meteor.call('createBooking', localBooking, function (error) {
                    if (error) {
                        console.log('CreateBooking [FixExpense]:', 'Error when inserting booking.');
                    } else {
                        console.log('CreateBooking [FixExpense]: Success when inserting booking');
                    }
                });
            }
        }
    }
);
