'use strict';

const appRoot = require('app-root-path');
const config = require(appRoot + '/config');
const logger = require(appRoot + '/server/lib/logger');
const co = require('co');
const app = require('./app');

const ENV = process.env.NODE_ENV || 'development';

co(function* () {
	// Init db
	logger.info('Initiating db: ');
	logger.info('DB config:', config.db);
	yield app.context.db.connect(config.db);
	logger.info('DB init done.');

	const PORT = process.env.PORT || config.port;
	logger.info('App is listening on port: ', PORT);
	app.listen(PORT);
}).catch(function (err) {
	logger.error('Error starting server: ', err);
	logger.error(err.stack);
});
