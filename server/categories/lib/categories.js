var Boom = require('boom');

var internals = {
    db: null
};

module.exports = function (dao) {
    internals.dao = dao;

    var categories = {};

    categories.listCategories = function listCategories (request, reply) {
        dao.getCategories(true, function (err, rows) {
            if (err) {
                return reply(Boom.badImplementation('Unexpected error getting categories from database: ' + err));
            }
            else {
                return reply(rows);
            }
        });
    };

    return categories;
};
