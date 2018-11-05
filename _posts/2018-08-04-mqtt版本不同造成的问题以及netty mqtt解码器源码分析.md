---
layout: post
title: mqtt版本分析,netty mqtt编码器
comments: true
categories: technology
---

昨天客户端mqtt开发中,发生了一个问题.如下:


![fixHeader1](https://github.com/zhoufeilongjava/markdownPictures/blob/master/github/mqtt/fixHeader1.png)

![fixHeader2](https://github.com/zhoufeilongjava/markdownPictures/blob/master/github/mqtt/fixHeader2.png)

日志中显示,客户端订阅主题后,服务端返回的SUBACK数据包中,fixHeader为0x92, 解析错误,连接被强制关闭.

客户端使用的是mqtt3.1.1版本,经查看官方文档,SUBACK的fixHeader包为:1001 0000 解析结果应该为0x90才是.

![mqtt3.1.1](https://github.com/zhoufeilongjava/markdownPictures/blob/master/github/mqtt/mqtt311.png)

服务端用的是moquette,使用的版本为v3.1.0

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
