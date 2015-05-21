var Lab = require('lab');
var Code = require('code');
var Config = require('../config');


var lab = exports.lab = Lab.script();


lab.experiment('Config', function () {

    lab.test('it gets config data', function (done) {

        Code.expect(Config.get('/')).to.be.an.object();

        done();
    });


    lab.test('it gets config meta data', function (done) {

        Code.expect(Config.meta('/')).to.match(/this file configures the hapi-ring server/i);

        done();
    });


    lab.test('it should have a server port setting', function (done) {

        Code.expect(Config.get('/port')).to.be.a.number();

        done();
    });


    lab.test('it should have a database connection setting', function (done) {

        Code.expect(Config.get('/database/connection')).to.be.a.string();

        done();
    });
});
