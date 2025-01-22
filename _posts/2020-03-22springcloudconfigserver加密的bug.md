---
layout: post
title: spring cloud config server加密的bug
comments: true
categories: bug集中营
---

config server的加密，可以通过/encrypt加密，decrypt解密。

只要在application中配置盐即可，细节查看官方文档即可，不再概述。

这里所要说的bug是：
decrypt接口无法禁用。


在实际开发中，普通开发人员不应该给他有能解开加密配置的可能性，那么就要把decrypt接口禁用吧，config server提供了禁用的配置

    spring.cloud.config.server.encrypt.enabled=true
    
这行配置的意思就是禁用encrypt接口，但是源码中并没有实现，这个配置没有用到

源码

org.springframework.cloud.config.server.encryption.EncryptionController


        @RequestMapping(value = "decrypt", method = RequestMethod.POST)
        public String decrypt(@RequestBody String data,
                @RequestHeader("Content-Type") MediaType type) {
    
            return decrypt(this.defaultApplicationName, this.defaultProfile, data, type);
        }
        
        @RequestMapping(value = "/decrypt/{name}/{profiles}", method = RequestMethod.POST)
        public String decrypt(@PathVariable String name, @PathVariable String profiles,
                @RequestBody String data, @RequestHeader("Content-Type") MediaType type) {
            checkEncryptorInstalled(name, profiles);
            try {
                String input = stripFormData(this.helper.stripPrefix(data), type, true);
                Map<String, String> encryptorKeys = this.helper.getEncryptorKeys(name,
                        profiles, data);
                TextEncryptor encryptor = this.encryptor.locate(encryptorKeys);
                String decrypted = encryptor.decrypt(input);
                logger.info("Decrypted cipher data");
                return decrypted;
            }
            catch (IllegalArgumentException | IllegalStateException e) {
                logger.error("Cannot decrypt key:" + name + ", value:" + data, e);
                throw new InvalidCipherException();
            }
        }
        
        private String stripFormData(String data, MediaType type, boolean cipher) {
        
        if (data.endsWith("=") && !type.equals(MediaType.TEXT_PLAIN)) {
            try {
                data = URLDecoder.decode(data, "UTF-8");
                if (cipher) {
                    data = data.replace(" ", "+");
                }
            }
            catch (UnsupportedEncodingException e) {
                // Really?
            }
            String candidate = data.substring(0, data.length() - 1);
            if (cipher) {
                if (data.endsWith("=")) {
                    if (data.length() / 2 != (data.length() + 1) / 2) {
                        try {
                            Hex.decode(candidate);
                            return candidate;
                        }
                        catch (IllegalArgumentException e) {
                            try {
                                Base64Utils.decode(candidate.getBytes());
                                return candidate;
                            }
                            catch (IllegalArgumentException ex) {
                            }
                        }
                    }
                }
                return data;
            }
            // User posted data with content type form but meant it to be text/plain
            data = candidate;
        }

        return data;

    }
    
    
github上对应的bug  ：https://github.com/spring-cloud/spring-cloud-config/issues/1548