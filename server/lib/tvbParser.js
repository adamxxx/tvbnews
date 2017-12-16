'use strict';

const _ = require('lodash');
const appRoot = require('app-root-path');
const BB = require('bluebird');
const xmlreader = BB.promisifyAll(require('xmlreader'));
const tvb = require(appRoot + '/server/lib/tvb');
const logger = require(appRoot + '/server/lib/logger');

const VIDEO_KEYS = ['video500k','video1500k','video300k'];
const VIDEO_ANDROID_KEYS = ['video_android_500k','video_android_1500k','video_android_300k'];
const IMAGES_KEYS = ['image_url_0','image_url_1','image_url_2', 'image_url_3'];

function textGetter(path) {
	return typeof path === 'function' ? path() : '';
}

function* pullProgrammeOne(ctx, path) {
	const xmlString = yield tvb.getProgramme(path);
	const res = yield xmlreader.readAsync(xmlString);
	let createdNo = 0;

	logger.info('pulling the pgm: ', path);
	if (!res.rss.channel.item){
		return {'programme': path, 'no': createdNo};
	}

	const programmeList = [];
	for (let i = res.rss.channel.item.count() - 1; i >= 0; i--) {
		const pgm = {};
		_.set(pgm, 'item_id', res.rss.channel.item.at(i).attributes().id);
		const dbObj = yield ctx.db.programmedetail.findOne({item_id: pgm.item_id});
		if (dbObj) continue;

		_.set(pgm, 'description', textGetter(res.rss.channel.item.at(i).description.text));
		_.set(pgm, 'first_time_onair', textGetter(res.rss.channel.item.at(i).first_time_onair.text));

		let count = !res.rss.channel.item.at(i).image ? 0 : res.rss.channel.item.at(i).image.count();
		for (let j = 0; j < count && j < 4; j++) {
			_.set(pgm, IMAGES_KEYS[j], res.rss.channel.item.at(i).image.at(j).attributes().url);
		}

		_.set(pgm, 'path', path);
		_.set(pgm, 'onair_episode_no', textGetter(res.rss.channel.item.at(i).onair_episode_no.text));
		_.set(pgm, 'programme_title', textGetter(res.rss.channel.item.at(i).programme_title.text));
		_.set(pgm, 'pubDate', textGetter(res.rss.channel.item.at(i).pubDate.text));
		_.set(pgm, 'title', textGetter(res.rss.channel.item.at(i).title.text));

		count = !res.rss.channel.item.at(i).video ? 0 : res.rss.channel.item.at(i).video.count();
		for (let j = 0; j < count && j < 3; j ++) {
			_.set(pgm, VIDEO_KEYS[j], res.rss.channel.item.at(i).video.at(j).attributes().url);
		}

		count = !res.rss.channel.item.at(i).video_android ? 0 : res.rss.channel.item.at(i).video_android.count();
		for (let j = 0; j < count && j < 3; j ++) {
			_.set(pgm, VIDEO_ANDROID_KEYS[j], res.rss.channel.item.at(i).video_android.at(j).attributes().url);
		}

		createdNo++;
		programmeList.push(yield ctx.db.programmedetail.findOneAndUpdate({item_id: pgm.item_id}, pgm, {upsert: true, setDefaultsOnInsert: true}))
	}

	yield programmeList;
	const obj = {'programme': path, 'total': createdNo};
	logger.info(obj);
	return obj;
}

module.exports = {
	pullFocus: function*(ctx) {
		const timerList = yield ctx.db.timer.find().limit(1);
		const timerLatest = _.get(timerList[0], 'Latest_date', 0);
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

				if (new Date(timerLatest).getTime() < new Date(res.rss.channel.item.at(items_count).attributes().publish_datetime).getTime()) {
					focusList.push(focus.save());
				}
			} catch (err) {
				logger.warn("Parser Error in " + res.rss.channel.pubDate.text() + " focus,item_id:!" + res.rss.channel.item.at(items_count).attributes().id + " ::: " + err);
			}
		}
		const result = yield focusList;
		const newTimerLatest = _.max(timerNewTime);

		if (!_.get(timerList[0], 'id')) {
			yield ctx.db.timer.create({Latest_date: newTimerLatest});
		} else {
			timerList[0].Latest_date = newTimerLatest;
			yield timerList[0].save()
		}

		const obj = {
			'focus': result.length,
			'action': 'pullFocus'
		};
		yield ctx.db.pullog.create({
			content: obj
		});
		return obj;
	},

	pullLive: function*(ctx) {
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

		const obj = {
			'live': 0,
			'action': 'pullLive'
		};
		if (!liveDbObj.lastBuildDate || new Date(live.lastBuildDate).getTime() > new Date(liveDbObj.lastBuildDate).getTime()) {
			const createdObj = yield live.save();
			obj.live = 1;
			obj.live_id = createdObj._id;
		}

		yield ctx.db.pullog.create({
			content: obj
		});
		return obj;
	},

	pullProgrammes: function*(ctx) {
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
			const dbObj = yield ctx.db.programmes.findOne({
				path: pgm.path
			});
			if (!dbObj) {
				createdNo++;
			}
			programmeList.push(yield ctx.db.programmes.findOneAndUpdate({
				path: pgm.path
			}, pgm, {
				upsert: true,
				setDefaultsOnInsert: true
			}))
		}

		yield programmeList;
		const obj = {
			'programmes': createdNo,
			'action': 'pullProgrammes'
		};
		yield ctx.db.pullog.create({
			content: obj
		});
		return obj;
	},

	pullProgrammesAll: function*(ctx) {
		const list = yield ctx.db.programmes.find().lean();
		const yeildList = [];

		for (const pgm of list) {
			yeildList.push(pullProgrammeOne(ctx, pgm.path));
		}

		let result = [];
		while (yeildList.length !== 0) {
			result = result.concat(yield yeildList.splice(0, 5));
		}

		logger.info(result);
		const obj = {
			'programmes': result,
			'action': 'pullProgrammesAll'
		};
		yield ctx.db.pullog.create({
			content: obj
		});
		return result;
	},

	sayHi: function(){
		return {hello: 'world!'}
	}
}
