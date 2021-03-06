var Hoek = require('hoek');
var Performers = require('./lib/performers');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);

    var performersHandler = new Performers(options.dao);

    server.route({
        method: 'GET',
        path: options.basePath + '/performers',
        handler: performersHandler.listPerformers
    });

    server.route({
        method: 'GET',
        path: options.basePath + '/performers/{startLetter}',
        handler: performersHandler.listPerformersStartingWith
    });


    next();
};


exports.register.attributes = {
    name: 'api-performers'
};
