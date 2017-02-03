'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const programmesSchema = new Schema({
	first_time_onair: {type: String},
	image_url_0: {type: String},
	image_url_1: {type: String},
	is_post: {type: Boolean, default: true},
	item_id: {type: String},
	pubDate: {type: String},
	newest_episode_no: {type: String, default: ''},
	path: {type: String},
	description: {type: String, default: ''},
	show_order: {type: Number, default: 1000},
	title: {type: String},
}, {timestamps: {createdAt: '_created_at', updatedAt: '_updated_at'}});

programmesSchema.index({path: 1});
programmesSchema.index({_created_at: -1});
programmesSchema.index({_updated_at: -1});

module.exports = mongoose.model('programmes', programmesSchema);
