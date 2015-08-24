function disableFields(template, fieldnames) {
    _.each(fieldnames, function (element, index, list) {
        $(element).prop('disabled', true);
    });
}