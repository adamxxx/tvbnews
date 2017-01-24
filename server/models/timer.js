'use strict';
// {
//   "_id": "jgY33fYTfz",
//   "Latest_date": "Sun, 15 Jan 2017 23:30:00 +0800",
//   "_created_at": new Date(1396798041091),
//   "_updated_at": new Date(1484497806587)
// }
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsControlSchema = new Schema({
	Latest_date: {
		type: String
	}
}, {
	timestamps: {
		createdAt: '_created_at',
		updatedAt: '_updated_at'
	}
});

newsControlSchema.index({
	created_at: -1
});

module.exports = mongoose.model('timers', newsControlSchema);
