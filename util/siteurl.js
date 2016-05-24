var urllib      = require("url"),
    config      = require('../config'),
    cheerio     = require('cheerio');


var randomIpv4 = require('random-ipv4');
var request    = require('request');
var _          = require('underscore');

/**
 * 伪造IP
 */
var getFakeIp = function() {
    return randomIpv4('{token1}.{token2}.{token3}.{token4}', {
        token1:{
            min: 137,
            max: 191
        },
        token2:{
            min: 17,
            max: 192
        },
        token3:{
            min: 2,
            max: 200
        }
    });
};


var getUrl = function(count) {
    category = 'news_tech';
    return 'http://toutiao.com/api/article/recent/?source=2&count='+count+'&category=' +category+ '&utm_source=toutiao&offset=0';
};

var analyzeJsonResult = function(jsonString) {
    var obj = JSON.parse(jsonString);
    var result = [];
    if(obj.message && obj.message == 'success' && obj.data) {
        _.each(obj.data, function(item) {
            result.push({url: item.display_url, title: item.title, abstract: item.abstract});
        });
    }
    return result;
};


var getJsonResult = function(url) {
    return new Promise(function(resolve, reject){
        userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36';
        fakeIP = getFakeIp();
        requestConfig = {
            url: url, 
            timeout: 5000, 
            followRedirect: true,
            headers: {
                'User-Agent': userAgent,
                'X-Forwarded-For': fakeIP,
                'X-Real-IP': fakeIP
            }
        };

        request(requestConfig, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject(Error(error));
            }
        });
    });
};


/**
 * 合并url
 * @param  {Array} oldUrls Array of url item
 * @param  {Array} newUrls Array of url item
 * @return {Array}         Array of url item
 */
function mergeUrls(oldUrls, newUrls) {
    var urlsMap  = {};
    var urlsList = []; 
    _.each(oldUrls, function(item) {
        urlsMap[item.url] = item;
    });
    _.each(newUrls, function(item) {
        urlsMap[item.url] = item;
    });

    _.map(urlsMap, function(item, url){
        urlsList.push(item);
    });

    return urlsList;
}


exports.getFakeIp = getFakeIp;
exports.getUrl = getUrl;
exports.analyzeJsonResult = analyzeJsonResult;
exports.getJsonResult = getJsonResult;
exports.mergeUrls = mergeUrls;