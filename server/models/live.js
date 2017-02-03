'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const liveSchema = new Schema({
	pubDate: {type: String},
	lastBuildDate: {type: String},
	title: {type: String},
	description: {type: String},
	path: {type: String},
	video_web: {type: String},
	video_web_hd: {type: String},
	video_android: {type: String},
	video_android_hd: {type: String},
	audio: {type: String},
	image: {type: String},
}, {timestamps: {createdAt: '_created_at', updatedAt: '_updated_at'}});

liveSchema.index({_created_at: -1});
liveSchema.index({_updated_at: -1});

module.exports = mongoose.model('lives', liveSchema);
