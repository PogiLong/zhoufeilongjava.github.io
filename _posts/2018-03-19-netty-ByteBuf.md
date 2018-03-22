---
layout: post
comments: true
categories: java
---


### ByteBuf被划分为三个缓冲区
capacity会自动扩容.



       (已读)丢弃字节区        可读字节区            可写字节区
    +-------------------+------------------+------------------+
    | discardable bytes |  readable bytes  |  writable bytes  |
    +-------------------+------------------+------------------+
    |                   |                  |                  |
    0      <=      readerIndex   <=   writerIndex    <=    capacity



## ButeBuf方法:

### 一.可读字节区字节:

遍历可读字节区字节

while(buffer.isReadable()) {
	Sout(buffer.readByte())
}

### 二.可写字节区

写一个随机Interger

while (buffer.maxWritableBytes() >= 4) {
     buffer.writeInt(random.nextInt());
}

### 三.已读字节区

清除(已读)丢弃字节区

BEFORE discardReadBytes()


    +-------------------+------------------+------------------+
    | discardable bytes |  readable bytes  |  writable bytes  |
    +-------------------+------------------+------------------+
    |                   |                  |                  |
    0      <=      readerIndex   <=   writerIndex    <=    capacity


AFTER discardReadBytes()
 
    +------------------+--------------------------------------+
    |  readable bytes  |    writable bytes (got more space)   |
    +------------------+--------------------------------------+
    |                  |                                      |
    readerIndex (0) <= writerIndex (decreased)        <=   capacity

清除之后可读字节区的下标readerIndex置零,可读字节下标writerIndex - 丢弃字节区长度.



清除缓冲区

 BEFORE clear()
 
    +-------------------+------------------+------------------+
    | discardable bytes |  readable bytes  |  writable bytes  |
    +-------------------+------------------+------------------+
    |                   |                  |                  |
    0      <=      readerIndex   <=   writerIndex    <=    capacity
 
 
   AFTER clear()
 
    +---------------------------------------------------------+
    |             writable bytes (got more space)             |
    +---------------------------------------------------------+
    |                                                         |
    0 = readerIndex = writerIndex            <=            capacity


