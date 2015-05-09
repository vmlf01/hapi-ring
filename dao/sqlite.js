/**
 * Created by vmlf on 05-05-2015.
 */
var Hoek = require('hoek');
var sqlite3 = require('sqlite3');

var internals = {
    defaults: {
        verbose: true,
        connection: ':memory:'
    },
    options: {},
    connect: function connect (cb) {
        console.log('SQLite: Connecting to ' + internals.options.connection);
        new sqlite3.Database(
            internals.options.connection,
            sqlite3.OPEN_READWRITE,
            function (err) {
                cb(err, this);
            }
        );
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
    })
};


exports.executeQueryWithParam = function executeQuery (query, param, cb) {
    internals.connect(function (err, db) {
        if (err) {
            return cb(err, null);
        }
        else {
            return db.all(query, param, function (err, rows) {
                db.close();
                if (err) {
                    return cb(err, null);
                }
                else {
                    return cb(null, rows);
                }
            });
        }
    })
};
