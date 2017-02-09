'use strict';

const _ = require('lodash');
const appRoot = require('app-root-path');
const tvbParser = require(appRoot + '/server/lib/tvbParser');

function numberPasrer(num, max = 100) {
	return Number(num) <= max && Number(num) > 0 ? Number(num) : 10;
}

module.exports = {
	focus: function*(next) {
		const ctx = this;
		let {
			limit = 10,
			skip = 0,
		} = ctx.query;
		limit = numberPasrer(limit);
		skip = numberPasrer(skip);
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
		limit = numberPasrer(limit);
		skip = Number(skip);
		if (!path)
			ctx.body = yield ctx.db.programmes.find().skip(skip).limit(limit).sort('-_updated_at').lean();
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
