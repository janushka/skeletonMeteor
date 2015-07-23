/**
 * Created by Njoku on 29.10.2014.
 */

Package.describe({
    summary: "Eine Klasse die, die CategoriesAmounts-Collection ändert.",
    version: "1.0.0"
});

Package.on_use(function (api, where) {
    api.use([], 'client');

    //api.add_files(['berechnung.js'], 'client');
    api.add_files(['manipulate-categoriesamounts-collection.js']);

    if (api.export)
        api.export('ManipulateCategoriesAmounts');
});