module.exports = {
    dbpath: __dirname + '/data/siteline.db',
    crawler: {
        interval: 60*60*1000,       // ms
    },
    server: {
        host: '127.0.0.1',
        port: '5678',
        title: '今日头条 科技版块',
        abstract: '昨日科技头条，整合过去的科技相关报道'
    }
};