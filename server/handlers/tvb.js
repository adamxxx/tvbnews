'use strict';

const _ = require('lodash');
const appRoot = require('app-root-path');
const requireAll = require('require-all');
const BB = require('bluebird');
const xmlreader = BB.promisifyAll(require('xmlreader'));
const tvb = require(appRoot + '/server/lib/tvb');
const logger = require(appRoot + '/server/lib/logger');

function* pullFocus(ctx) {
	const timerList = yield ctx.db.timer.find().limit(1);
	const timer = timerList[0];
	const xmlString = yield tvb.getFocus();
	const res = yield xmlreader.readAsync(xmlString);

	const focusList = [];
	const timerNewTime = [];
	for (let items_count = res.rss.channel.item.count() - 1; items_count >= 0; items_count--) {
		const focus = ctx.db.focus();
		let image_url;

		try {
			_.set(focus, "focus_pubDate", res.rss.channel.pubDate.text());
			_.set(focus, "item_id", res.rss.channel.item.at(items_count).attributes().id);
			_.set(focus, "title", res.rss.channel.item.at(items_count).title.text());
			_.set(focus, "pubDate", res.rss.channel.item.at(items_count).attributes().publish_datetime);

			try {
				_.set(focus, "category", res.rss.channel.item.at(items_count).category.text());
			} catch (err) {
				logger.warn(res.rss.channel.item.at(items_count).attributes().id + " ::: No category!!");
			}

			try {
				_.set(focus, "tags", res.rss.channel.item.at(items_count).tags.text());
			} catch (err) {
				logger.warn(res.rss.channel.item.at(items_count).attributes().id + " ::: No tags!!");
			}

			try {
				for (var i = 0; i < res.rss.channel.item.at(items_count).image.count(); i++) {
					if (res.rss.channel.item.at(items_count).image.at(i).attributes().default == '1' &&
						res.rss.channel.item.at(items_count).image.at(i).attributes().type == 'thumbnail') {
						_.set(focus, "image_url", res.rss.channel.item.at(items_count).image.at(i).attributes().url);
						// image_url  = res.rss.channel.item.at(items_count).image.at(i).attributes().url;
					}
					if (res.rss.channel.item.at(items_count).image.at(i).attributes().default == '1' &&
						res.rss.channel.item.at(items_count).image.at(i).attributes().type == 'big') {
						_.set(focus, "image_url_big", res.rss.channel.item.at(items_count).image.at(i).attributes().url);
						// image_url  = res.rss.channel.item.at(items_count).image.at(i).attributes().url;
					}
				}
			} catch (err) {
				logger.warn(res.rss.channel.item.at(items_count).attributes().id + " ::: No image!!");
			}

			const pubTime = res.rss.channel.item.at(items_count).attributes().publish_datetime;
			timerNewTime.push(new Date(pubTime));
			try {
				_.set(focus, "video300k", res.rss.channel.item.at(items_count).video.at(0).attributes().url);
				_.set(focus, "video500k", res.rss.channel.item.at(items_count).video.at(1).attributes().url);
			} catch (err) {
				logger.warn(res.rss.channel.item.at(items_count).attributes().id + " ::: No video!!");
			}

			try {
				_.set(focus, "description", res.rss.channel.item.at(items_count).description.text());
			} catch (err) {
				logger.warn(res.rss.channel.item.at(items_count).attributes().id + " ::: No description!!");
			}

			if (new Date(timer.Latest_date).getTime() < new Date(res.rss.channel.item.at(items_count).attributes().publish_datetime).getTime()) {
				focusList.push(focus.save());
			}
		} catch (err) {
			logger.warn("Parser Error in " + res.rss.channel.pubDate.text() + " focus,item_id:!" + res.rss.channel.item.at(items_count).attributes().id + " ::: " + err);
		}
	}
	const result = yield focusList;
	timer.Latest_date = _.max(timerNewTime);
	yield timer.save();
	yield ctx.db.pullog.create({
		content: {'focus': result.length}
	});
	return {'focus': result.length};
}

function* sayHi(){
	return {hello: 'world!'};
}

module.exports = {
	focus: function*(next) {
		const ctx = this;
		const {
			limit = 10
		} = ctx.query;
		ctx.body = yield ctx.db.focus.find().limit(Number(limit)).sort('-_created_at');
	},

	pull: function*(next) {
		const ctx = this;
		const {
			action
		} = ctx.query;

		const actionMapping = {
			focus: pullFocus
		};
		const result = yield _.get(actionMapping, action, sayHi)(ctx);
		ctx.body = result;
	}
};
