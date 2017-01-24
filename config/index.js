'use strict';

const _ = require('lodash');

const config = {};
const developmentConfig = require('./env/development');
const testingSource = require('./env/testing');
const productionSource = require('./env/production');

const envConfig = {
	development: developmentConfig,
	testing: _.merge({}, developmentConfig, testingSource),
	production: _.merge({}, developmentConfig, productionSource)
};

const ENV = process.env.NODE_ENV || 'development';
module.exports = envConfig[ENV];