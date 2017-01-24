'use strict';

const appRoot = require('app-root-path');
const _ = require('lodash');

const logger = require(appRoot + '/server/lib/logger');

module.exports = function* (next) {
	const ctx = this;

	try {
		yield next;
	} catch (err) {
		logger.error(err.toString());
		logger.error(err.stack);

		ctx.status = 403;
		ctx.body = err.message;
	}
};
