var Boom = require('boom');
var Joi = require('joi');
var Hoek = require('hoek');
var Contents = require('./lib/contents');


var internals = {
    notImplemented: function (request, reply) {
        return reply(Boom.notImplemented('endpoint handler is not yet implemented!'));
    }
};


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);

    var contentsHandler = new Contents(options.dao);

    server.route({
        method: 'GET',
        path: options.basePath + '/top',
        config: {
            handler: contentsHandler.listTopContents,
            validate: {
                query: {
                    i: Joi.number().integer().min(0).optional().default(0),
                    n: Joi.number().integer().min(0).max(100).optional().default(10)
                }
            }
        }
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/contents/category/{categoryId}',
        config: {
            handler: contentsHandler.listCategoryContents,
            validate: {
                params: {
                    categoryId: Joi.string().guid()
                },
                query: {
                    i: Joi.number().integer().min(0).optional().default(0),
                    n: Joi.number().integer().min(0).max(100).optional().default(10)
                }
            }
        }
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/contents/performer/{performerId}',
        config: {
            handler: internals.notImplemented,
            validate: {
                params: {
                    performerId: Joi.string().guid()
                },
                query: {
                    i: Joi.number().integer().min(0).optional().default(0),
                    n: Joi.number().integer().min(0).max(100).optional().default(10)
                }
            }
        }
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/contents/details/{contentId}',
        config: {
            handler: internals.notImplemented,
            validate: {
                params: {
                    contentId: Joi.string().guid()
                }
            }
        }
    });


    next();
};


exports.register.attributes = {
    name: 'api-contents'
};
