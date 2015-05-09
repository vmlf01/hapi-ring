var Confidence = require('confidence');


var criteria = {
    env: process.env.NODE_ENV
};


var config = {
    $meta: 'This file configures the hapi-ring server.',
    projectName: 'hapi-ring',
    port: {
        $filter: 'env',
        test: 9090,
        $default: 8080
    },
    database: {
        $filter: 'env',
        test: {
            connection: ':memory:',
            verbose: true
        },
        $default: {
            connection: __dirname + '/db/PortalConteudos.sqlite',
            verbose: false
        }
    }
};


var store = new Confidence.Store(config);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
