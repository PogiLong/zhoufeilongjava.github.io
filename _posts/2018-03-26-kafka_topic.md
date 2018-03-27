---
layout: post
title: kafka:消息中间件
comments: true
categories: java
---


![pull](https://raw.githubusercontent.com/zhoufeilongjava/markdownPictures/master/github/kafka/kafka-topic.png)

如图所示:kafka的一个topic可分为多个分区,每个分区都是一个有序的，不可变的记录序列，不断追加到结构化的提交日志中。 分区中的记录每个分配一个连续的id号，称为偏移量，用于唯一标识分区内的每条记录。

![producer_consumer](https://raw.githubusercontent.com/zhoufeilongjava/markdownPictures/master/github/kafka/kafka-producer-consumer.png)

在每个消费者中保留的元数据都有其对应的偏移量(offset),随着消费者读取数据,偏移量会线性增加,当然消费者可以自定义读取,比如跳至某个位置并从当前位置(now)读取.

    //API:    比如:指定topic和分区从头开始读取数据
    consumer.seekToBeginning(Collections.singletonList(new TopicPartition("topic", 1)));
    
    //shell
    ./kafka-console-consumer --bootstrap-server localhost:9092 --from-beginning --topic queue.push
    


## kafka springboot

gradle依赖:

    compile('org.springframework.kafka:spring-kafka')
    
application.yml配置:

    kafka:
          producer:
            retries: 1 #发布失败后重新尝试1次
            batch-size: 16384 #可批处理的数据量(条)
            buffer-memory: 33554432 #可缓存的数据量大小
            key-serializer: org.apache.kafka.common.serialization.StringSerializer #键序列化方式
            value-serializer: org.apache.kafka.common.serialization.StringSerializer #值序列化方式
          bootstrap-servers: 'localhost:9093' #用于建立到kafka集群的主机/端口列表,如多个用,分隔
          
          
          
序列化方式可以自定义,继承 org.apache.kafka.common.serialization.Serializer<T>.


     public class RawItemSerializer implements Serializer<RawItem> {
     
         @Override
         public void configure(Map<String, ?> configs, boolean isKey) {}
     
         @Override
         public byte[] serialize(String topic, RawItem data) {
             return SerializerUtil.serialize(data);
         }
     
         @Override
         public void close() {}
     }
     
     
application.yml中的配置:

    value-serializer: net.sonma.openapi.kafka.RawItemSerializer
    
在springboot中使用

    @Service
    public class PrinterService {

        private final KafkaTemplate<String, RawItem> kafkaTemplate;
        
        @Autowired
        public PrinterService(KafkaTemplate<String, RawItem> kafkaTemplate) {
            this.kafkaTemplate = kafkaTemplate;
        }
        
        
        private void print(Printer printer, RawItem item) {
            kafkaTemplate.send("items", String.valueOf(printer.getSn()), item);
        }

    }
    
    
就现在而言消息传递是不安全的,kafka提供了ssl支持.

#### 1.用java的keytools生成密钥和证书

    keytool -keystore server.keystore.jks -alias localhost -validity {validity} -genkey
    
{validity}:证书的有效期(天)

可以运行该指令查看证书内容:

    keytool -list -v -keystore server.keystore.jks
    



通过第一步，集群中的每台机器都生成一对公私钥，和一个证书来识别机器。但是，证书是未签名的，这意味着攻击者可以创建一个这样的证书来假装成任何机器。

#### 2.生成CA负责证书签名.

    openssl req -new -x509 -keyout ca-key -out ca-cert -days 365
    
下面将生成的CA添加到客户的信任库中(truststore).

    keytool -keystore client.truststore.jks -alias CARoot -import -file ca-cert
    
服务器中配置 ssl.client.auth(”requested" 或 "required”) ,要求broker对客户端进行验证,
为broker提供信任库及签名了密钥的CA证书.

    keytool -keystore server.truststore.jks -alias CARoot -import -file ca-cert
    
#### 3.签名证书

用生成的CA签名生成的证书

从密钥仓库中导出证书

    keytool -keystore server.keystore.jks -alias localhost -certreq -file cert-file
    
CA签名

    openssl x509 -req -CA ca-cert -CAkey ca-key -in cert-file -out cert-signed -days {validity} -CAcreateserial -passin pass:{ca-password}
    
导入CA的证书和已签名的证书到密钥仓库

    keytool -keystore server.keystore.jks -alias CARoot -import -file ca-cert
    keytool -keystore server.keystore.jks -alias localhost -import -file cert-signed



### kafka broker的配置

server.properteis:

    listeners=PLAINTEXT://host.name:port,SSL://host.name:port
    
    ssl.keystore.location=/......../server.keystore.jks
    ssl.keystore.password=123456
    ssl.key.password=test1234
    ssl.truststore.location=/........./server.truststore.jks
    ssl.truststore.password=123456
    
    
### kafka客户端配置

     ssl:
       truststore-location: /........./client.truststore.jks
       truststore-password: '123456'
     properties:
           security.protocol : SSL



