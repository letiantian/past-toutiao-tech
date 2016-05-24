var koa = require('koa');
var route = require('koa-route');
var bodyParser = require('koa-body-parser');
var parse = require('co-body');
var views = require('co-views');
var serve = require('koa-static');
var _  = require('underscore');


var app = koa();
require('koa-qs')(app, 'first')
var render = views(__dirname + '/views', { map: { html: 'ejs' } });
var cache = require("lru-cache")({ max: 100, maxAge: 20*60*1000});


var sqlite3 = require('sqlite3').verbose();
var config   = require('../config');
var db = new sqlite3.Database(config.dbpath);
var dbUtil   = require('../util/db');
var dateUtil   = require('../util/date');
var urlUtil   = require('../util/siteurl');
var helper   = require('../util/helper');
var config   = require('../config');

var debug = require('debug')('server');   // $ DEBUG=server node web.js

var SUCCESS = 'success',
    FAIL    = 'fail';

app.use(serve(__dirname + '/static'));
app.use( require('koa-json')() );


app.use(route.get('/', index));
app.use(route.get('/about', about));
app.use(route.get('/content', showContent));

function *index() {    

    this.body = yield render('index', {});

}

function *about() {
    this.body = {title: config.server.title, abstract: config.server.abstract};
    debug(this.body);
}

function *showContent() {
    try {
        debug(this.query);

        // should check query

        var startDateStr = dateUtil.getDateStr(this.query.year, this.query.month, this.query.day, 0, 0, 0);
        var endDateStr = dateUtil.getDateStr(this.query.year, this.query.month, this.query.day, 23, 59, 59);
        var startTs = dateUtil.getTimeStampFromDate(startDateStr, this.query.timezone);
        var endTs = dateUtil.getTimeStampFromDate(endDateStr, this.query.timezone||'Asia/Shanghai');

        var key = startTs;
        var result = cache.get(key);
        if(!result) {
            // debug('未命中缓存');
            rows = yield dbUtil.selectToutiao(db, startTs, endTs);
            if (rows.length == 0) {
                result = [];
            } else {
                result = helper.json2obj((rows[0].content));
                _.each(rows, function(row) {
                    content = helper.json2obj((row.content));
                    result = urlUtil.mergeUrls(result, content);
                });
            }
        }
        if (!result) {
            result = {message: SUCCESS, data:'[]'};
        } else {
            cache.set(key, result);
        }
        this.body = {message: SUCCESS, data: result};
    } catch(err) {
        this.body = {message: FAIL};
    }
}

app.listen(config.server.port, config.server.host);
debug('listening on ' + config.server.host + ':'+config.server.port);