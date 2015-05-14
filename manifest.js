var Confidence = require('confidence');
var Config = require('./config');


var criteria = {
    env: process.env.NODE_ENV
};


var manifest = {
    $meta: 'This file defines the hapi-ring server.',
    server: {
        debug: {
            request: ['error']
        },
        connections: {
            router: {
                isCaseSensitive: false,
                stripTrailingSlash: true
            },
            routes: {
                security: true
            }
        }
    },
    connections: [{
        port: Config.get('/port'),
        labels: ['api']
    }],
    plugins: {
        './dao/sqlite': {
            verbose: Config.get('/database/verbose'),
            connection: Config.get('/database/connection')
        },
        './dao/sqliteContentsRepository': { db: require('./dao/sqlite') },
        './server/categories': { dao: require('./dao/sqliteContentsRepository') },
        './server/performers': { dao: require('./dao/sqliteContentsRepository') },
        './server/contents': { dao: require('./dao/sqliteContentsRepository') }
    }
};


var store = new Confidence.Store(manifest);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
