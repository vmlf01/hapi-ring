var Composer = require('./index');


Composer(function (err, server) {

    if (err) {
        throw err;
    }

    server.start(function () {

        console.log('Started the server on ' + server.info.uri);
    });
});
