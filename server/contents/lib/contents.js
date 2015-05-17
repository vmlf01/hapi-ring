var Boom = require('boom');

var internals = {
    db: null
};

module.exports = function (dao) {
    internals.dao = dao;

    var contents = {};

    contents.listTopContents = function listTopContents (request, reply) {
        var startIndex = request.query.i || 0;
        var numberOfItems = request.query.n || 10;


        dao.getTopContents(startIndex, numberOfItems, function (err, rows) {
            if (err) {
                return reply(Boom.badImplementation('Unexpected error getting top contents from database: ' + err));
            }
            else {
                return reply(rows);
            }
        });
    };


    contents.listCategoryContents = function listCategoryContents (request, reply) {
        var categoryId = request.params.categoryId;
        var startIndex = request.query.i || 0;
        var numberOfItems = request.query.n || 10;


        dao.getCategoryContents(categoryId, startIndex, numberOfItems, function (err, rows) {
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
