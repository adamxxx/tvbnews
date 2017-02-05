'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const programmeSchema = new Schema({
	description: {type: String, default: ''},
	first_time_onair: {type: String},
	image_url_0: {type: String, default: ''},
	image_url_1: {type: String, default: ''},
	image_url_2: {type: String, default: ''},
	image_url_3: {type: String, default: ''},
	is_post: {type: Boolean, default: true},
	item_id: {type: String},
	onair_episode_no: {type: String},
	path: {type: String},
	programme_title: {type: String},
	pubDate: {type: String},
	show_order: {type: Number, default: 1000},
	title: {type: String},
	video1500k: {type: String, default: ''},
	video300k: {type: String, default: ''},
	video500k: {type: String, default: ''},
	video_android_1500k: {type: String, default: ''},
	video_android_300k: {type: String, default: ''},
	video_android_500k: {type: String, default: ''},
}, {timestamps: {createdAt: '_created_at', updatedAt: '_updated_at'}});

programmeSchema.index({path: 1});
programmeSchema.index({_created_at: -1});
programmeSchema.index({_updated_at: -1});

module.exports = mongoose.model('programmedetails', programmeSchema);
