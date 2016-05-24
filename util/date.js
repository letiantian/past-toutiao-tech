var moment = require('moment-timezone');
var leftPad = require('left-pad');
var format = require('string-format');


var getTimeStamp = function() {
    return moment().unix();
};


var getTimeStampFromDate = function(dateStr, timeZone) {
    // moment.tz("2014-06-01 12:00", "America/New_York");
    return moment.tz(dateStr, timeZone).valueOf() / 1000;
};


var getDateStr = function(year, month, day, hour, minute, second) {
    year = leftPad(year, 4, 0);
    month = leftPad(month, 2 ,0);
    day = leftPad(day, 2 ,0);
    hour = leftPad(hour, 2 ,0);
    minute = leftPad(minute, 2 ,0);
    second = leftPad(second, 2 ,0);
    return format('{}-{}-{} {}:{}:{}', year, month, day, hour, minute, second);
};


var today = function() {
    var m = moment();
    return {year: m.year(), month: m.month()+1, day: m.date()};
};


exports.getTimeStamp  = getTimeStamp;
exports.getTimeStampFromDate = getTimeStampFromDate;
exports.getDateStr = getDateStr;
exports.today    = today;