if (process.env.NODE_ENV !== 'production'){
    require('longjohn');
}

var sqlite3 = require('sqlite3').verbose();
var co      = require('co');
var _       = require('underscore');

var config   = require('./config');
var dateUtil = require('./util/date');
var urlUtil  = require('./util/siteurl');
var dbUtil   = require('./util/db');
var helper   = require('./util/helper');

var debug = require('debug')('crawler');  // $ DEBUG=crawler node crawler_cli.js

var db = new sqlite3.Database(config.dbpath);

var sleep = function(ms) {
  return function(done){
    setTimeout(done, ms);
  }
};

var crawlOnce = co.wrap(function *() {
    debug('start crawl...');
    yield dbUtil.createTable(db);
    
    var url = urlUtil.getUrl(20);
    debug(url);

    var currentTs = dateUtil.getTimeStamp();
    debug(currentTs);

    jsonResult = yield urlUtil.getJsonResult(url);

    urlsList = urlUtil.analyzeJsonResult(jsonResult);
    debug(urlsList.length);

    yield dbUtil.insertToutiao(db, currentTs, helper.obj2json(urlsList));

});


co(function*(){
    isSleep = false;
    process.on('SIGINT', function() {
        debug("Caught interrupt signal");
        if (isSleep) {
            process.exit();
        }
    });
    while(true) {
        yield crawlOnce();
        isSleep = true;
        yield sleep(config.crawler.interval);
        isSleep = false;
    }
}).then(function(){}, function(err){
    debug(err);
});