var Boom = require('boom');
var Hoek = require('hoek');
var Contents = require('./lib/contents');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);

    var contentsHandler = new Contents(options.dao);

    server.route({
        method: 'GET',
        path: options.basePath + '/top',
        handler: contentsHandler.listTopContents
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/contents/category/{categoryId}',
        handler: notImplemented
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/contents/performer/{performerId}',
        handler: notImplemented
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/contents/details/{contentId}',
        handler: notImplemented
    });


    next();
};


exports.register.attributes = {
    name: 'api-contents'
};


function notImplemented(request, reply) {
    return reply(Boom.notImplemented('endpoint handler is not yet implemented!'));
}
