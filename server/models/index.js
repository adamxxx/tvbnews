'use strict';
const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;
bluebird.promisifyAll(mongoose);

let Db = {
	focus: require('./focus'),
	timer: require('./timer'),
	pullog: require('./pullog')
};

Db.connect = function* (uri) {
	yield mongoose.connectAsync(uri);
};

Db.disconnect = function* () {
	yield mongoose.disconnectAsync();
};

module.exports = Db;
