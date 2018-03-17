---
layout: post
title: docker:使用dockerfile构建镜像
comments: true
categories: technology
---

# 一.在jar包所在的目录,创建名为Dockerfile的文件

执行指令

    touch Dockerfile
    
# 二.dockerfile中写内容

    #基于的镜像
    FROM java
    #将本地文件夹挂载到当前容器
    VOLUME /root/blog
    #复制文件到当前容器
    ADD blog-0.0.1-SNAPSHOT.jar blog.jar
    RUN bash -c 'touch /blog.jar'
    #声明需要暴露的端口
    EXPOSE 8080
    #配置容器后执行的命令
    ENTRYPOINT ["java","-jar","/blog.jar"]
    
    
# 使用docker build命令构建镜像

docker build -t test/test-0.0.1 .
#格式:docker build -t 仓库名称/镜像名称(:标签) Dockerfile的相对位置.

执行命令后可以看到镜像构建的详细过程:

    Sending build context to Docker daemon  26.29MB
    Step 1/6 : FROM java
     ---> d23bdf5b1b1b
    Step 2/6 : VOLUME /root/blog
     ---> Using cache
     ---> 5c3b6a64c372
    Step 3/6 : ADD blog-0.0.1-SNAPSHOT.jar blog.jar
     ---> Using cache
     ---> f8ef658cd900
    Step 4/6 : RUN bash -c 'touch /blog.jar'
     ---> Using cache
     ---> 315f7f5bf2f0
    Step 5/6 : EXPOSE 8080
     ---> Using cache
     ---> ecf2b01d4df6
    Step 6/6 : ENTRYPOINT ["java","-jar","/blog.jar"]
     ---> Using cache
     ---> 32ff6071fde3
    Successfully built 32ff6071fde3
    Successfully tagged test:latest
    
    
#启动镜像

    docker run -d -p 80:8080 test/test-0.0.1
    
访问宿主机的80端口,可以看到容器运行成功.