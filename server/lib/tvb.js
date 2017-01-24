'use strict';

const _ = require('lodash');
const appRoot = require('app-root-path');
const xmlparse = require('xmlreader');

const config = require(appRoot + '/config');
const logger = require(appRoot + '/server/lib/logger');
const request = require('request-promise');
const HEADER = {
    'Pragma': 'no-cache',
    'Accept-Encoding': 'gzip, deflate, sdch',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Cache-Control': 'no-cache',
};

const BASE = 'http://m.tvb.com';

const PATHS = {
	// http://tvbnewbbb.appspot.com/?url=http://m.tvb.com/news/focus
	focus: '/news/focus'
}

function* callTVB(method, path, option) {
	try {
		const payload = {
			method: method,
			uri: BASE + path,
			headers: HEADER,
			gzip: true,
			json: true
		};
		if (option && ['POST', 'PUT'].indexOf(method) > -1) {
			_.set(payload, 'body', option);
		} else if (option && ['GET', 'DELETE'].indexOf(method) > -1) {
			_.set(payload, 'qs', option);
		}

		return yield request(payload);
	} catch (e) {
		logger.error(e);
		throw e;
	}
}

module.exports = {
	getFocus: function* () {
		return yield callTVB('GET', PATHS.focus);
	}
};

// var co = require('co');
// co(function* () {
// 	// var mongoose = require('mongoose');
// 	// mongoose.connect('mongodb://localhost/test');
// 	// const bluebird = require('bluebird');

// 	// mongoose.Promise = bluebird;
// 	// bluebird.promisifyAll(mongoose);
// 	// const Cat = require(appRoot + '/server/models/newsControl');

// 	// var kitty = new Cat({ Latest_date: "xfdf" });

// 	// var res = yield kitty.save();
// 	let res = yield callTVB('GET', PATHS.focus);
//   console.log(res);
// }).catch(e=>{
// 	console.log('err', res);
// });

