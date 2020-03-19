---
layout: post
title: springboot的单元测试真tm坑
comments: true
categories: bug集中营
---

直接说，springboot的单元测试无法指定多个profile。

        @RunWith(SpringJUnit4ClassRunner.class)
        @SpringBootTest(classes = Start.class)
        
启用多个profile的写法

        @RunWith(SpringJUnit4ClassRunner.class)
        @SpringBootTest(classes = Start.class, properties = {"spring.profiles.active=a,b"})
        
或者是

        @RunWith(SpringJUnit4ClassRunner.class)
        @SpringBootTest(classes = Start.class)
        @ActiveProfiles({"a","b"})
        
        
然而这并不起作用，它只会启用一个。

我的项目中会在application.yml中配置各个环境通用的配置项，其它环境，如application-dev.yml，application-test.yml则
使用各自的配置项。

问题就出在这，我的单元测试写法是指定spring.profiles.active=dev，然而application.yml中的通用配置无法注入。
哪怕写成spring.profiles.active=default,dev也不行，使用@ActiveProfiles({"default","dev"})同样不行。

https://github.com/spring-projects/spring-boot/issues/7668