'use strict';

const _ = require('lodash');
const appRoot = require('app-root-path');
const tvbParser = require(appRoot + '/server/lib/tvbParser');

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

	pgm: function*(next) {
		const ctx = this;
		let {
			limit = 10,
			skip = 0,
		} = ctx.query;
		const path = ctx.params.path;
		limit = Number(limit) > 100 ? 100 : Number(limit);
		skip = Number(skip) > 100 ? 100 : Number(skip);
		if (!path)
			// const list = yield ctx.db.programmes.find().lean();
			ctx.body =  yield ctx.db.programmes.find().skip(skip).limit(limit).sort('-_updated_at').lean();
		else
			ctx.body = yield ctx.db.programmedetail.find({path: path}).skip(skip).limit(limit).sort('-_updated_at').lean();
	},

	pull: function*(next) {
		const ctx = this;
		const {
			action
		} = ctx.query;

		const actionMapping = {
			focus: tvbParser.pullFocus,
			live: tvbParser.pullLive,
			pgm: tvbParser.pullProgrammes,
			pgmAll: tvbParser.pullProgrammesAll
		};
		const result = yield _.get(actionMapping, action, tvbParser.sayHi)(ctx);
		ctx.body = result;
	}
};
