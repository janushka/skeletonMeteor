/**
 * Created by Njoku on 16.06.2015.
 */

Template.ifNewBooking.isPresent = function () {
    if (Session.get('bookingAddedAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifNewCategory.isPresent = function () {
    if (Session.get('categoryAddedAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifCategoriesAlert.isPresent = function () {
    if (Categories.find().count() === 0) {
        if (Session.get('categoriesAlert')) {
            return false;
        }
        return true;
    } else {
        return false;
    }
};

Template.ifCategoriesLink.isPresent = function () {
    if (Categories.find().count() === 0) {
        return false;
    } else {
        return true;
    }
};

Template.ifEditCategory.isPresent = function () {
    if (Session.get('categoryUpdatedAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifNoChangesCategory.isPresent = function () {
    if (Session.get('categoryNoChangesAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifDeleteCategory.isPresent = function () {
    if (Session.get('categoryDeletedAlert')) {
        return true;
    } else {
        return false;
    }
};

/*Template.ifBookingData.helpers({
    isPresent: function () {
        if (Bookings.find().count() === 0) {
            return true;
        } else {
            return true;
        }
    }
});

Template.ifLayoutCategoriesData.isPresent = function () {
    if (Categories.find().count() === 0) {
        if (Session.get('categoriesAlert')) {
            return false;
        }
        return false;
    } else {
        return true;
    }
};

Template.ifTimeWindow.isChecked = function () {
    if (Session.get('timeWindow')) {
        return false;
    }
    return true;
};

Template.ifCategoriesAlert.isPresent = function () {
    if (Categories.find().count() === 0) {
        if (Session.get('categoriesAlert')) {
            return false;
        }
        return true;
    } else {
        return false;
    }
};

Template.ifCategoriesLink.isPresent = function () {
    if (Categories.find().count() === 0) {
        return false;
    } else {
        return true;
    }
};


Template.ifNewBooking.isPresent = function () {
    if (Session.get('bookingAddedAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifEditBooking.isPresent = function () {
    if (Session.get('bookingUpdatedAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifNoChangesBooking.isPresent = function () {
    if (Session.get('bookingNoChangesAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifDeleteBooking.isPresent = function () {
    if (Session.get('bookingDeletedAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifNewCategory.isPresent = function () {
    if (Session.get('categoryAddedAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifEditCategory.isPresent = function () {
    if (Session.get('categoryUpdatedAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifNoChangesCategory.isPresent = function () {
    if (Session.get('categoryNoChangesAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifDeleteCategory.isPresent = function () {
    if (Session.get('categoryDeletedAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifDependentBookings.isPresent = function () {
    if (Session.get('dependentBookingsAlert')) {
        return true;
    } else {
        return false;
    }
};

Template.ifDateOutOfRange.isOutOfRange = function () {
    if (Session.get('dateOutOfRange')) {
        return true;
    } else {
        return false;
    }
};*/






