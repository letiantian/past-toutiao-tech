# 昨日头条（科技版块）
抓取今日头条每天抓取的科技新闻。

![](./art/demo.gif)

Node必须支持**Promise** 和 **Generator**.

## 爬虫抓取

```
$ node crawler_cli.js
```
默认每1小时抓取一次。配置见config.js。

## Web Server

```
$ node server/web.js
```

配置见config.js。 浏览器访问`http://<your-ip>:5678`即可。

## Web API
均为GET请求。

```
$ curl http://127.0.0.1:5678/about
{
  "title": "今日头条 科技版块",
  "abstract": "昨日科技头条，整合过去的科技相关报道"
}  
```


```
$ curl http://127.0.0.1:5678/content?year=2016&month=5&day=24&timezone=Asia%2FShanghai
{
  "message": "success",
  "data": [
    {
      "url": "http://m.haiwainet.cn/ttc/3541839/2016/0524/content_29948213_1.html?s=toutiao",
      "title": "库克承认iPhone售价过高 未来或适当下调",
      "abstract": "新浪科技讯 北京时间5月24日凌晨消息，苹果公司（以下简称“苹果”）CEO蒂姆·库克（Tim Cook）日前在接受印度NDTV电视台采访时称，当前iPhone手机的售价有点高，将来会适当下调。库克说：“我承认，iPhone的售价有点高。随着时间的推移，我们也想做一些事情，把iPh"
    },
    {
      "url": "http://toutiao.com/group/6287741637398429953/",
      "title": "百度全面封杀小说类贴吧，是突然想起来打击盗版了？",
      "abstract": "不少网友发现，百度上不少知名网络小说吧被封，同时类似校花等大型贴吧也被封杀。而据网友爆料，贴吧被封开始于今日凌晨1点左右，目前一大批网络文学类贴吧都处于被封状态。包括《鬼吹灯》、《盗墓笔记》在内的不少知名网络小说贴吧都被百度直接封禁，若点击进入吧，跳转出的是“抱歉，根据相关法律法"
    },

......
```




## 依赖
```
$ cd past-toutiao-tech
$ npm install
```


```
$ sudo apt-get instal sqlite3
$ sqlite3 foo.db
```


## 配置
下面是Ubuntu下supervisor和nginx的配置示例：

**/etc/supervisor/conf.d/past-toutiao-tech-server.conf**
```
[program:past-toutiao-tech-server]
command=/usr/local/bin/node /path/to/past-toutiao-tech/server/web.js
autostart=true
autorestart=true
user=username
stderr_logfile=/path/to/past-toutiao-tech/supervisor.err.log
```

**/etc/supervisor/conf.d/past-toutiao-tech-crawler.conf**
```
[program:past-toutiao-tech-crawler]
command=/usr/local/bin/node /path/to/past-toutiao-tech/crawler_cli.js --crawlforever
autostart=true
autorestart=true
user=username
```

**/etc/nginx/sites-enabled/past-toutiao-tech.conf**
```
upstream past-toutiao-tech {
    server 127.0.0.1:5678;
}

server 
{
    listen 80;
    server_name your.domain.com;
    server_name_in_redirect  off;
    access_log  off;
    
    #root /path/to/past-toutiao-tech;
    error_log /path/to/past-toutiao-tech/nginx-error.log;

    # Allow file uploads
    client_max_body_size 1M;

    proxy_read_timeout 10;

    location / {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
        proxy_pass http://past-toutiao-tech;
    }
}
```

## License
MIT