'use strict';

const appRoot = require('app-root-path');
const co = require('co');
const _ = require('lodash');
const BB = require('bluebird');
const logger = require(appRoot + '/server/lib/logger')
const request = require('request-promise');
const Scheduler = require('node-schedule');
const schedule = '*/10 * * * *';

co(function* () {
	logger.info('cronjob started!');
	Scheduler.scheduleJob(schedule, function () {
		logger.info('Job started!', new Date());
		co(function* () {
			const uri = 'http://localhost:9000/v1/pull?action=focus';
			const result = yield request(uri);
			logger.info(new Date(), result);
		}).catch(function(e){
			logger.error(e);
		});
	});
}).catch(function (err) {
	logger.error('CronJob', 'Error deatil:', err);
	logger.error('CronJob', 'Error stack:', err.stack);
	process.exit(1);
});
