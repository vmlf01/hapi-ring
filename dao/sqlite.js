/**
 * Created by vmlf on 05-05-2015.
 */
var Hoek = require('hoek');
var sqlite3 = require('sqlite3');

var internals = {
    defaults: {
        verbose: true,
        connection: ':memory:',
        pageMaxItems: 100
    },
    options: {},
    connect: function connect (cb) {
        internals.logVerbose('Connecting to ' + internals.options.connection);
        var db = new sqlite3.Database(
            internals.options.connection,
            sqlite3.OPEN_READWRITE
        );

        db.once('error', function (err) {
            cb(err, null);
        });
        db.once('open', function () {
            cb(null, this);
        });
    },
    logVerbose: function (msg) {
        if (internals.options.verbose) {
            console.log('SQLite: ' + msg);
        }
    }
};


exports.register = function (server, options, next) {

    internals.options = Hoek.applyToDefaults(internals.defaults, options);

    if (options.verbose) {
        sqlite3.verbose();
    }


    next();
};


exports.register.attributes = {
    name: 'sqlite-data-adapter'
};


exports.execute = function execute (actionsCb, cb) {

    internals.connect(function (err, db) {

        if (err) {
            return cb(err, null);
        }
        else {
            return actionsCb(db, function (err, result) {

                db.close();
                if (err) {
                    return cb(err, null);
                }
                else {
                    return cb(null, result);
                }
            });
        }
    });
};


exports.executeQuery = function executeQuery (query, cb) {

    internals.connect(function (err, db) {

        if (err) {
            return cb(err, null);
        }
        else {
            return db.all(query, function (err, rows) {

                db.close();
                if (err) {
                    return cb(err, null);
                }
                else {
                    return cb(null, rows);
                }
            });
        }
    });
};


exports.executeQueryWithParams = function executeQuery (query, params, cb) {

    internals.connect(function (err, db) {

        if (err) {
            return cb(err, null);
        }
        else {
            return db.all(query, params, function (err, rows) {

                db.close();
                if (err) {
                    return cb(err, null);
                }
                else {
                    return cb(null, rows);
                }
            });
        }
    });
};


exports.executePagedQuery = function executePagedQuery (query, cb)
{
    // query is an object with following structure:
    //{
    //    columns,
    //    from,
    //    where,
    //    orderBy,
    //    params,
    //    startIndex,
    //    numberOfItems
    //}


    var pageQuery = ' SELECT ' + query.columns +
        ' FROM ' + query.from +
        (query.where ? ' WHERE ' + query.where : '') +
        (query.orderBy ? ' ORDER BY ' + query.orderBy : '') +
        ' LIMIT $count OFFSET $start ';

    var queryParams = {
        $start: query.startIndex || 0,
        $count: query.numberOfItems && query.numberOfItems < internals.options.pageMaxItems ?
            query.numberOfItems :
            internals.options.pageMaxItems // return a maximum of 100 rows
    };

    Hoek.merge(queryParams, query.params);

    exports.execute(function (db, done) {

        // get results page

        internals.logVerbose('Executing ' + pageQuery);
        internals.logVerbose('  With params: ' + JSON.stringify(queryParams));
        return db.all(pageQuery, queryParams, function (err, rows) {
            if (err) {
                return done(err, null);
            }
            else {

                // get total results count

                var countQuery = ' SELECT COUNT(*) as totalRows FROM ' + query.from +
                    (query.where ? ' WHERE ' + query.where : '');

                return db.get(countQuery, query.params, function (err, count) {
                    if (err) {
                        return done(err, null);
                    }
                    else {
                        return done(null, {
                            results: rows,
                            totalRows: count.totalRows
                        });
                    }
                });
            }
        });
    }, cb);
};



