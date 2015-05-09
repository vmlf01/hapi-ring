var Hoek = require('hoek');
var Categories = require('./lib/categories');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);

    var categoriesHandler = new Categories(options.dao);

    server.route({
        method: 'GET',
        path: options.basePath + '/categories',
        handler: categoriesHandler.listCategories
    });


    next();
};


exports.register.attributes = {
    name: 'api-categories'
};
