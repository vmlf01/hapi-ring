var Boom = require('boom');

var internals = {
    dao: null
};

module.exports = function (dao) {
    internals.dao = dao;

    var performers = {};

    performers.listPerformers = function listPerformers (request, reply) {
        dao.getPerformers(true, function (err, rows) {
            if (err) {
                return reply(Boom.badImplementation('Unexpected error getting performers from database: ' + err));
            }
            else {
                return reply(rows);
            }
        });
    };

    performers.listPerformersStartingWith = function listPerformersStartingWith (request, reply) {
        dao.getPerformersStartingWith(request.params.startLetter, true, function (err, rows) {
            if (err) {
                return reply(Boom.badImplementation('Unexpected error getting performers from database: ' + err));
            }
            else {
                return reply(rows);
            }
        });
    };


    return performers;
};
