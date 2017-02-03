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
				_.set(focus, "video300k", res.rss.channel.item.at(items_count).video_android.at(0).attributes().url);
				_.set(focus, "video500k", res.rss.channel.item.at(items_count).video_android.at(1).attributes().url);
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
	const obj = {'focus': result.length, 'action': 'pullFocus'};
	yield ctx.db.pullog.create({
		content: obj
	});
	return obj;
}

function* pullLive(ctx) {
	const xmlString = yield tvb.getLive();
	const res = yield xmlreader.readAsync(xmlString);

	// get latest live form db
	let liveDbObj = yield ctx.db.live.find().limit(1).sort('-_updated_at');
	liveDbObj = liveDbObj[0] || {};

	const live = ctx.db.live();

	_.set(live, "pubDate", res.rss.channel.pubDate.text());
	_.set(live, "lastBuildDate", res.rss.channel.lastBuildDate.text());

	_.set(live, "title", res.rss.channel.item.at(0).title.text());
	_.set(live, "description", res.rss.channel.item.at(0).description.text());
	_.set(live, "path", res.rss.channel.item.at(0).path.text());

	const video_web = res.rss.channel.item.at(0).video_web.at(0).attributes();
	const video_web_hd = res.rss.channel.item.at(0).video_web.at(1).attributes();
	_.set(live, "video_web", video_web.url + video_web.vid_file);
	_.set(live, "video_web_hd", video_web_hd.url + video_web_hd.vid_file);


	_.set(live, "video_android", res.rss.channel.item.at(0).video_android.at(0).attributes().url);
	_.set(live, "video_android_hd", res.rss.channel.item.at(0).video_android.at(1).attributes().url);
	_.set(live, "audio", res.rss.channel.item.at(0).audio.at(0).attributes().url);

	_.set(live, "image", res.rss.channel.item.at(0).image.at(0).attributes().url);

	const obj = {'live': 0, 'action': 'pullLive'};
	if (!liveDbObj.lastBuildDate || new Date(live.lastBuildDate).getTime() > new Date(liveDbObj.lastBuildDate).getTime()) {
		const createdObj = yield live.save();
		obj.live = 1;
		obj.live_id = createdObj._id;
	}

	yield ctx.db.pullog.create({
		content: obj
	});
	return obj;
}

function* pullProgrammes(ctx){
	const xmlString = yield tvb.getProgrammesList();
	const res = yield xmlreader.readAsync(xmlString);

	const programmeList = [];
	let createdNo = 0;
	for (let i = res.rss.channel.item.count() - 1; i >= 0; i--) {
		let pgm = {};
		_.set(pgm, 'pubDate', res.rss.channel.pubDate.text());
		_.set(pgm, 'item_id', res.rss.channel.item.at(i).attributes().id);
		_.set(pgm, 'title', res.rss.channel.item.at(i).title.text());
		_.set(pgm, 'path', res.rss.channel.item.at(i).path.text());
		if (typeof res.rss.channel.item.at(i).description.text === 'function') {
			_.set(pgm, 'description', res.rss.channel.item.at(i).description.text());
		}
		_.set(pgm, 'image_url_0', res.rss.channel.item.at(i).image.at(0).attributes().url);
		_.set(pgm, 'image_url_1', res.rss.channel.item.at(i).image.at(1).attributes().url);
		_.set(pgm, 'first_time_onair', res.rss.channel.item.at(i).first_time_onair.text());
		const dbObj = yield ctx.db.programmes.findOne({path: pgm.path});
		if (!dbObj) {
			createdNo++;
		}
		programmeList.push(yield ctx.db.programmes.findOneAndUpdate({path: pgm.path}, pgm, {upsert: true, setDefaultsOnInsert: true}))
	}

	yield programmeList;
	const obj = {'programmes': createdNo, 'action': 'pullProgrammes'};
	yield ctx.db.pullog.create({
		content: obj
	});
	return obj;
}

function* sayHi(){
	return {hello: 'world!'};
}

module.exports = {
	focus: function*(next) {
		const ctx = this;
		let {
			limit = 10,
			skip = 0,
		} = ctx.query;
		limit = Number(limit) > 100 ? 100 : Number(limit);
		skip = Number(skip) > 100 ? 100 : Number(skip);
		ctx.body = yield ctx.db.focus.find().skip(skip).limit(limit).sort('-_created_at');
	},

	live: function*(next) {
		const ctx = this;
		ctx.body = (yield ctx.db.live.find().limit(1).sort('-_updated_at'))[0] || {};
	},

	pull: function*(next) {
		const ctx = this;
		const {
			action
		} = ctx.query;

		const actionMapping = {
			focus: pullFocus,
			live: pullLive,
			programmes: pullProgrammes
		};
		const result = yield _.get(actionMapping, action, sayHi)(ctx);
		ctx.body = result;
	}
};
