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
