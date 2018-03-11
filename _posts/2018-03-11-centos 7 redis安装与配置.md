---
layout: post
title: centos 7 redis安装与配置
comments: true
categories: technology
---

# yum安装

    yum install redis
  
# 启动redis

    systemctl start redis.service
    
# 设置开启启动

    systemctl enable redis.service
    
# 配置redis

    vi /etc/redis.conf

## 远程连接允许
    bind 0.0.0.0
    
## 密码设置

    requirepass <定义密码>
    
# 重启redis

    systemctl restart redis