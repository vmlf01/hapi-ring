var Boom = require('boom');

var internals = {
    db: null
};

module.exports = function (dao) {
    internals.dao = dao;

    var contents = {};

    contents.listTopContents = function listTopContents (request, reply) {
        dao.getTopContents(0, 4, function (err, rows) {
            if (err) {
                return reply(Boom.badImplementation('Unexpected error getting top contents from database: ' + err));
            }
            else {
                return reply(rows);
            }
        });
    };

    return contents;
};
