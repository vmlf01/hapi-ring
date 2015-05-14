var Hoek = require('hoek');
var Contents = require('./lib/contents');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);

    var contentsHandler = new Contents(options.dao);

    server.route({
        method: 'GET',
        path: options.basePath + '/contents',
        handler: contentsHandler.listTopContents
    });


    next();
};


exports.register.attributes = {
    name: 'api-contents'
};
