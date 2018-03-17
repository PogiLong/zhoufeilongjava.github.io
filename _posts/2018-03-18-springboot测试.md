---
layout: post
title: springboot:springboot测试
comments: true
categories: java
---

springboot为开发者提供了一套测试模块:spring-test.

gradle中引入依赖

    dependencies {

    testCompile("org.springframework.boot:spring-boot-starter-test")
    }
    
maven中引入依赖:

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    
# 一.不依赖spring的单元测试

    public class SimpleTest {
        
        @Test
        public void test() {
            System.out.println("test");
        }
    }
    
# 二.需要应用springboot集成测试

    @RunWith(SpringRunner.class)
    @SpringBootTest
    public class SimpleSpringTest {
    
        @Autowired
        private SimpleService service;
        
        @Test
        public void test() {
            service.test();
        }
    }
 
    @Service   
    public class SimpleService {
         public void test() {
         System.out.println("test");
    }
    
加上springBootTest注解后,spring会自动加载应用上下文.
它会从当前测试类一层层向上搜索,直到找到含有@SpringBootApplication或者@SpringBootConfiguration的注解类,来确定装载spring应用上下文.

## 2.1 @RunWith(SpringRunner.class)注解.

该注解使Junit运行在spring的测试环境中,以便得到spring应用上下文.(des:在spring4.3之前该注解是 @RunWith(SpringJUnit4ClassRunner.class))

# 三.MVC控制器测试

可无需启动http服务器即可测试接口

    @RunWith(SpringRunner.class)
    @WebMvcTest
    public class SimpleSpringMvcTest {
    
        @Autowired
        private MockMvc mvc;
        
        @Test
        public void test() {
            mvc.perform(get("/test"))
                  .andExpect(status().isOk())
                  .andDo(print());
        }
    }
    
    
    
    @Controller
    public class TestController {
        
        @GetMapping("/test")
        @ResponseBody
        public String hello() {
            return "test";
        }
        
    }
    
注意:该注解能扫描到的类如下:
@Controller
@ControllerAdvice
@JsonComponent
Filter
WebMvcConfigurer
HandlerMethodArgumentResolver

@Service  @Component  @Repository等均不会被加载进上下文.

如需要加载其他bean,则可使用@MockBean注解

    @RunWith(SpringRunner.class)
    @WebMvcTest
    public class SimpleSpringMvcTest {
    
        @Autowired
        private MockMvc mvc;
        @MockBean
        private SimpleService service;
        
        @Test
        public void test() {
            //模拟service的调用,返回数据 test
            when(service.test()).thenReturn("test");
            mvc.perform(get("/test"))
                  .andExpect(status().isOk())
                  .andDo(print());
        }
    }
    
# 四.web测试
当需要http服务器测试spring时,可使用@SpringbootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
来随机启用一个端口,spring提供了TestRestTemplate来解析服务器的相对地址


    @RunWith(SpringRunner.class)
    @SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
    public class ApplicationTest {
    
        @Autowired
        private TestRestTemplate restTemplate;
        
        @Test
        public void testSayHello() {
            String result = restTemplate.getForObject("/test", String.class);
            System.out.println(result);
        }
        
    }
    
    
        @RestController
        public class TestController {
            
            @GetMapping("/test")
            public String test() {
            return "test";
        }
    }
    
# 五.h2数据库测试

引入内嵌数据库h2


    @RunWith(SpringRunner.class)
    @DataJpaTest
    public class H2Test {
        
        @Autowired
        private SimpleRepository respository;
        
        @Test
        public void test() {
            respository.save("test");
            
            respository.find("test");
        }
    }
    
@DataJpaTest注解只会引入@Entity 的bean.

如需珍视数据库测试,则加上@AutoConfigureTestDatabase(replace = Replace.NONE)注解,
该注解表示不要替换应用程序默认的数据源.使用配置的数据库信息.

在每次JPA测试后,都会发生事务回滚,如有特殊情况无需回滚,则加@Rollback(false),该注解即可标记在类上,也可以标记在
方法上,表示该类或方法无需数据回滚.

# 六.接口测试

    @RunWith(SpringRunner.class)
    @SpringBootTest
    @AutoConfigureMockMvc
    @WebAppConfiguration
    public class SimpleTest {
        @Autowired
        private MockMvc mvc;
        @Autowired
        private WebApplicationContext context;
        
        @Before
        public void before() {
            mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
        }
        
        @Test
        public void test() {
            mvc.perform(get("/test"))
                .andExpect(status().isOk())
                .andDo(print());
        }
    }
    
该测试则会测试真实接口请求与真实数据库数据.