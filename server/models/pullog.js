'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsControlSchema = new Schema({
	content: Object
}, {
	timestamps: {
		createdAt: '_created_at',
		updatedAt: '_updated_at'
	}
});

newsControlSchema.index({
	_created_at: -1
});

module.exports = mongoose.model('pullog', newsControlSchema);
