var co = require('co');


function execute(dbConn, sql, params) {
    return new Promise(function(resolve, reject) {
        dbConn.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


function findAll(dbConn, sql, params) {
    return new Promise(function(resolve, reject){
        dbConn.all(sql, params,function(err, rows) {
            if(err) {
                reject(err);
            }
            else {
                resolve(rows);  // 若没有数据，rows则是空数组
            }
        });
    });
}


function findOne(dbConn, sql, params) {
    return new Promise(function(resolve, reject){
        dbConn.get(sql, params, function(err, row) {
            if (err){
                reject(err);
            }
            else{
                resolve(row);   // 若没有数据，则为undefined
            }
        });
    });
}


function *createTable(dbConn) {
    var sql01 = `
            CREATE TABLE IF NOT EXISTS toutiao (       
                ts INTEGER NOT NULL,    
                content TEXT NOT NULL   
            );                            
        `;

    var sql02 = `
            CREATE UNIQUE INDEX IF NOT EXISTS uq_toutiao_ts 
            on toutiao(ts);        
        `;

    yield execute(dbConn, sql01, []);
    yield execute(dbConn, sql02, []);
}


 function *insertToutiao(dbConn, timestamp, content) {
    var sql = "INSERT INTO toutiao(ts, content) VALUES (?,?)";
    yield execute(dbConn, sql, [timestamp, content]);
}


function *selectToutiao(dbConn, timestampStart, timestampEnd) {
    var sql = "SELECT content FROM toutiao WHERE ts>=? AND ts<=?";
    result = yield findAll(dbConn, sql, [timestampStart, timestampEnd]);
    return result;
}

exports.createTable = co.wrap(createTable);
exports.insertToutiao  = co.wrap(insertToutiao);
exports.selectToutiao  = co.wrap(selectToutiao);