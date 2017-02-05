'use strict';

const Router = require('koa-router');
const requireAll = require('require-all');
const appRoot = require('app-root-path');

const handlers = requireAll(appRoot + '/server/handlers');

const router = new Router({
	prefix: '/v1'
});

router.get('/focus', handlers.tvb.focus);
router.get('/live', handlers.tvb.live);
router.get('/pgm', handlers.tvb.pgm);
router.get('/pgm/:path', handlers.tvb.pgm);

router.get('/pull', handlers.tvb.pull);

router.get('/whatthefuck', function* (){
	throw new Error('What the fuck!');
});

router.get('/check', function* (){
	this.body = {
		env: this.env,
		version: this.version
	}
});

module.exports = router;
