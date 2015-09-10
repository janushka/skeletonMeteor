/*
/!**
 * Created by Njoku on 29.10.2014.
 *!/

ManipulateCategoriesAmounts = {
    updateCategoriesByRange: function (range) {
        var bookingsList = [];
        var categoriesList = Categories.find().fetch();
        var begin;

        if (Array.isArray(range)) {
            begin = moment(range[0], 'DD-MM-YYYY').toDate();
            var end = moment(range[1], 'DD-MM-YYYY').toDate();
            bookingsList = Bookings.find({datum: {$gte: begin, $lte: end}}).fetch();
        } else if ((typeof range) === 'string') {
            switch (range) {
                case 'none':
                    break;
                case 'day':
                    begin = moment().startOf('day').toDate();
                    bookingsList = Bookings.find({datum: {$gte: begin}}).fetch();
                    break;
                case 'week':
                    begin = moment().startOf('week').toDate();
                    bookingsList = Bookings.find({datum: {$gte: begin}}).fetch();
                    break;
                case 'month':
                    begin = moment().startOf('month').toDate();
                    bookingsList = Bookings.find({datum: {$gte: begin}}).fetch();
                    break;
                case 'year':
                    begin = moment().startOf('year').toDate();
                    bookingsList = Bookings.find({datum: {$gte: begin}}).fetch();
                    break;
                case 'all':
                    bookingsList = Bookings.find().fetch();
                    break;
                default:
                    bookingsList = Bookings.find().fetch();
                    break;
            }
        } else {
            throw 'This type of range-input is forbidden!'
        }

        var groupedBookings = _.groupBy(bookingsList, function (booking) {
            return booking.category;
        });

        // Bookings must exist in order to display any amount related statistics greater than 0.
        if (_.isEmpty(groupedBookings)) {
            _.each(categoriesList, function (element, index, list) {
                Categories.update({_id: element._id}, {$set: {accumulatedAmount: 0}});
            });
        } else {
            _.each(bookingsList, function (element, index, list) {
                var accAmount = _.reduce(_.pluck(groupedBookings[element.category], 'amount'), function (memo, num) {
                    return memo + num;
                }, 0);

                Categories.update({_id: element.categoryId}, {$set: {accumulatedAmount: parseFloat(accAmount.toFixed(2))}});
            });
            var diffList = _.difference(_.pluck(categoriesList, '_id'), _.pluck(bookingsList, 'categoryId'));
            _.each(diffList, function (element, index, list) {
                Categories.update({_id: element}, {$set: {accumulatedAmount: 0}});
            });
        }
    },

    updateCategory: function (booking) {
        Categories.update({_id: booking.categoryId}, {$inc: {amount: booking.amount}});
    },

    resetForm: function (template, fieldnames) {
        _.each(fieldnames, function (element, index, list) {
            template.find(element).value = '';
        });
    },

    getTimeRangeTitle: function () {
        var tR = Session.get('timeRange');
        var title;

        switch (tR) {
            case 'none':
                break;
            case 'day':
                title = '(Tag)';
                break;
            case 'week':
                title = '(Woche)';
                break;
            case 'month':
                title = '(Monat)';
                break;
            case 'year':
                title = '(Jahr)';
                break;
            case 'all':
                title = '';
                break;
            default:
                title = '';
                break;
        }

        if (Session.get('timeWindow')) {
            title = '(Zeitfenster)';
        }

        return title;
    },

    getBookingList: function (category, range) {
        var bookingsList = [];
        var begin, end;

        if (category && range) {
            if (Array.isArray(range)) {
                begin = range[0];
                end = range[1];
                category === 'all' ? bookingsList = Bookings.find({
                    datum: {
                        $gte: begin,
                        $lte: end
                    }
                }, findOptions()).fetch() : bookingsList = Bookings.find({
                    category: category,
                    datum: {$gte: begin, $lte: end}
                }, findOptions()).fetch();
                return bookingsList;
            } else if ((typeof range) === 'string') {
                switch (range) {
                    case 'none':
                        break;
                    case 'day':
                        begin = moment().startOf('day').toDate();
                        category === 'all' ? bookingsList = Bookings.find({
                            datum: {$gte: begin}
                        }, findOptions()).fetch() : bookingsList = Bookings.find({
                            category: category,
                            datum: {$gte: begin}
                        }, findOptions()).fetch();
                        break;
                    case 'week':
                        begin = moment().startOf('week').toDate();
                        category === 'all' ? bookingsList = Bookings.find({
                            datum: {$gte: begin}
                        }, findOptions()).fetch() : bookingsList = Bookings.find({
                            category: category,
                            datum: {$gte: begin}
                        }, findOptions()).fetch();
                        break;
                    case 'month':
                        begin = moment().startOf('month').toDate();
                        category === 'all' ? bookingsList = Bookings.find({
                            datum: {$gte: begin}
                        }, findOptions()).fetch() : bookingsList = Bookings.find({
                            category: category,
                            datum: {$gte: begin}
                        }, findOptions()).fetch();
                        break;
                    case 'year':
                        begin = moment().startOf('year').toDate();
                        category === 'all' ? bookingsList = Bookings.find({
                            datum: {$gte: begin}
                        }, findOptions()).fetch() : bookingsList = Bookings.find({
                            category: category,
                            datum: {$gte: begin}
                        }, findOptions()).fetch();
                        break;
                    case 'all':
                        category === 'all' ? bookingsList = Bookings.find({}, findOptions()).fetch() : bookingsList = Bookings.find({
                            category: category
                        }, findOptions()).fetch();
                        break;
                    default:
                        category === 'all' ? bookingsList = Bookings.find({}, findOptions()).fetch() : bookingsList = Bookings.find({
                            category: category
                        }, findOptions()).fetch();
                        break;
                }
                return bookingsList;
            } else {
                throw 'This type of range-input is forbidden!'
            }
        }
        if (category && (range === undefined)) {
            category === 'all' ? bookingsList = Bookings.find(findOptions()).fetch() : bookingsList = Bookings.find({
                category: category
            }, findOptions()).fetch();
            return bookingsList;
        }
        if (range && (category === undefined)) {
            if (Array.isArray(range)) {
                begin = range[0];
                end = range[1];
                bookingsList = Bookings.find({datum: {$gte: begin, $lte: end}}, findOptions()).fetch();
                return bookingsList;
            } else if ((typeof range) === 'string') {
                switch (range) {
                    case 'none':
                        break;
                    case 'day':
                        begin = moment().startOf('day').toDate();
                        bookingsList = Bookings.find({
                            datum: {$gte: begin}
                        }, findOptions()).fetch();
                        break;
                    case 'week':
                        begin = moment().startOf('week').toDate();
                        bookingsList = Bookings.find({
                            datum: {$gte: begin}
                        }, findOptions()).fetch();
                        break;
                    case 'month':
                        begin = moment().startOf('month').toDate();
                        bookingsList = Bookings.find({
                            datum: {$gte: begin}
                        }, findOptions()).fetch();
                        break;
                    case 'year':
                        begin = moment().startOf('year').toDate();
                        bookingsList = Bookings.find({
                            datum: {$gte: begin}
                        }, findOptions()).fetch();
                        break;
                    case 'all':
                        bookingsList = Bookings.find({}, findOptions()).fetch();
                        break;
                    default:
                        bookingsList = Bookings.find({}, findOptions()).fetch();
                        break;
                }
                return bookingsList;
            } else {
                throw 'This type of range-input is forbidden!'
            }
        }

        bookingsList = Bookings.find({}, findOptions()).fetch();
        return bookingsList;
    },

    getBookingsCount: function (category, range) {
        var bookingsCount = [];
        var begin, end;

        if (category && range) {
            if (Array.isArray(range)) {
                begin = range[0];
                end = range[1];
                category === 'all' ? bookingsCount = Bookings.find({
                    datum: {
                        $gte: begin,
                        $lte: end
                    }
                }).count() : bookingsCount = Bookings.find({
                    category: category,
                    datum: {$gte: begin, $lte: end}
                }).count();
                return bookingsCount;
            } else if ((typeof range) === 'string') {
                switch (range) {
                    case 'none':
                        break;
                    case 'day':
                        begin = moment().startOf('day').toDate();
                        category === 'all' ? bookingsCount = Bookings.find({
                            datum: {$gte: begin}
                        }).count() : bookingsCount = Bookings.find({
                            category: category,
                            datum: {$gte: begin}
                        }).count();
                        break;
                    case 'week':
                        begin = moment().startOf('week').toDate();
                        category === 'all' ? bookingsCount = Bookings.find({
                            datum: {$gte: begin}
                        }).count() : bookingsCount = Bookings.find({
                            category: category,
                            datum: {$gte: begin}
                        }).count();
                        break;
                    case 'month':
                        begin = moment().startOf('month').toDate();
                        category === 'all' ? bookingsCount = Bookings.find({
                            datum: {$gte: begin}
                        }).count() : bookingsCount = Bookings.find({
                            category: category,
                            datum: {$gte: begin}
                        }).count();
                        break;
                    case 'year':
                        begin = moment().startOf('year').toDate();
                        category === 'all' ? bookingsCount = Bookings.find({
                            datum: {$gte: begin}
                        }).count() : bookingsCount = Bookings.find({
                            category: category,
                            datum: {$gte: begin}
                        }).count();
                        break;
                    case 'all':
                        category === 'all' ? bookingsCount = Bookings.find({}).count() : bookingsCount = Bookings.find({
                            category: category
                        }).count();
                        break;
                    default:
                        category === 'all' ? bookingsCount = Bookings.find({}).count() : bookingsCount = Bookings.find({
                            category: category
                        }).count();
                        break;
                }
                return bookingsCount;
            } else {
                throw 'This type of range-input is forbidden!'
            }
        }
        if (category && (range === undefined)) {
            category === 'all' ? bookingsCount = Bookings.find(findOptions()).count() : bookingsCount = Bookings.find({
                category: category
            }).count();
            return bookingsCount;
        }
        if (range && (category === undefined)) {
            if (Array.isArray(range)) {
                begin = range[0];
                end = range[1];
                bookingsCount = Bookings.find({datum: {$gte: begin, $lte: end}}).count();
                return bookingsCount;
            } else if ((typeof range) === 'string') {
                switch (range) {
                    case 'none':
                        break;
                    case 'day':
                        begin = moment().startOf('day').toDate();
                        bookingsCount = Bookings.find({
                            datum: {$gte: begin}
                        }).count();
                        break;
                    case 'week':
                        begin = moment().startOf('week').toDate();
                        bookingsCount = Bookings.find({
                            datum: {$gte: begin}
                        }).count();
                        break;
                    case 'month':
                        begin = moment().startOf('month').toDate();
                        bookingsCount = Bookings.find({
                            datum: {$gte: begin}
                        }).count();
                        break;
                    case 'year':
                        begin = moment().startOf('year').toDate();
                        bookingsCount = Bookings.find({
                            datum: {$gte: begin}
                        }).count();
                        break;
                    case 'all':
                        bookingsCount = Bookings.find({}).count();
                        break;
                    default:
                        bookingsCount = Bookings.find({}).count();
                        break;
                }
                return bookingsCount;
            } else {
                throw 'This type of range-input is forbidden!'
            }
        }

        bookingsCount = Bookings.find({}).count();
        return bookingsCount;
    },

    searchCategoriesAmounts: function (categories, range) {
        var bookingsList = [];
        var categoriesList = Categories.find({name: categories[0]}).fetch();
        var begin;

        if (Array.isArray(range)) {
            begin = moment(range[0], 'DD-MM-YYYY').toDate();
            var end = moment(range[1], 'DD-MM-YYYY').toDate();
            bookingsList = Bookings.find({datum: {$gte: begin, $lte: end}}).fetch();
        } else if ((typeof range) === 'string') {
            switch (range) {
                case 'none':
                    break;
                case 'day':
                    begin = moment().startOf('day').toDate();
                    bookingsList = Bookings.find({datum: {$gte: begin}}).fetch();
                    break;
                case 'week':
                    begin = moment().startOf('week').toDate();
                    bookingsList = Bookings.find({datum: {$gte: begin}}).fetch();
                    break;
                case 'month':
                    begin = moment().startOf('month').toDate();
                    bookingsList = Bookings.find({datum: {$gte: begin}}).fetch();
                    break;
                case 'year':
                    begin = moment().startOf('year').toDate();
                    bookingsList = Bookings.find({datum: {$gte: begin}}).fetch();
                    break;
                case 'all':
                    bookingsList = Bookings.find().fetch();
                    break;
                default:
                    bookingsList = Bookings.find().fetch();
                    break;
            }
        } else {
            throw 'This type of range-input is forbidden!'
        }

        var groupedBookings = _.groupBy(bookingsList, function (booking) {
            return booking.category;
        });

        // Bookings must exist in order to display any amount related statistics greater than 0.
        if (_.isEmpty(groupedBookings)) {
            _.each(categoriesList, function (element, index, list) {
                Categories.update({_id: element._id}, {$set: {accumulatedAmount: 0}});
            });
        } else {
            _.each(bookingsList, function (element, index, list) {
                var accAmount = _.reduce(_.pluck(groupedBookings[element.category], 'amount'), function (memo, num) {
                    return memo + num;
                }, 0);

                Categories.update({_id: element.categoryId}, {$set: {accumulatedAmount: parseFloat(accAmount.toFixed(2))}});
            });
            var diffList = _.difference(_.pluck(categoriesList, '_id'), _.pluck(bookingsList, 'categoryId'));
            _.each(diffList, function (element, index, list) {
                Categories.update({_id: element}, {$set: {accumulatedAmount: 0}});
            });
        }
    },

};

function findOptions() {
    return {sort:{datum: -1}, limit: Session.get('bookingsLimit')};
}*/
