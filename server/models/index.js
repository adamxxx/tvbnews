'use strict';
const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;
bluebird.promisifyAll(mongoose);

let Db = {
	focus: require('./focus'),
	live: require('./live'),
	timer: require('./timer'),
	pullog: require('./pullog'),
	programmes: require('./programmes'),
};

Db.connect = function* (uri) {
	yield mongoose.connectAsync(uri);
};

Db.disconnect = function* () {
	yield mongoose.disconnectAsync();
};

module.exports = Db;
