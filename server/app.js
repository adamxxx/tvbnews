'use strict';

const koa = require('koa');
const views = require('koa-views');
const logger = require('koa-logger');
const responseTime = require('koa-response-time');
const csrf = require('koa-csrf');
const helmet = require('koa-helmet');
const serve = require('koa-static');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const requireAll = require('require-all');
const appRoot = require('app-root-path');

const nodePackage = require(appRoot + '/package');
const config = require(appRoot + '/config');
const routers = requireAll(appRoot + '/server/routers');
const errorHandler = require(appRoot + '/server/middlewares/errorHandler');
const DB = require('./models/');

const app = new koa();

const ENV = process.env.NODE_ENV || 'development';
app.context.env = ENV;
app.context.version = nodePackage.version;

// app.use(views(__dirname + '/views', {
// 	extension: 'pug',
// 	map: {
// 		html: 'pug'
// 	}
// }));

app.use(serve(
	appRoot + '/public/'
));

csrf(app);

app.use(logger());

app.use(errorHandler);
app.use(cors());

// add db to context
app.context.db = DB;

// add config to context
app.context.cfg = config;

// add response time header
app.use(responseTime());

// add headers for security
app.use(helmet.dnsPrefetchControl());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

// body parser
// app.use(bodyParser());

app.use(routers.tvb.routes());

module.exports = app;
