---
date: "2017-06-28T19:05:03-07:00"
author: Ram Gopinathan
published: true
archived: true
title: "Using spring aop for automatic collection of metrics from your SpringBoot based Microservice"
categories: ["springboot"]
tags: ["springboot", "metrics", "telemetry", "dropwizard", "graphite", "grafana"]
---

# Overview
Application Telemetry is one of the key practices that is required to diagnose the health of your application or microservice. At T-Mobile like most of the organizations practicing DevOps we are also big on telemetry. In this post I will walk through how we collect what we call RED metrics from application code. RED stands for Request rate, Error rate, Duration (Latency). Additionaly we also collect metrics on resource consumption. Most of our code is written in Java so this is mostly JVM metrics.

## Approach
In a typical SpringBoot based Microservice there are multiple types and objects so our metrics collection solution needed to address some of the cross cutting scenarios. Thanks to AOP Support in SpringBoot this was pretty easy to implement.

### What is AOP
AOP stands for Aspect Oriented Programming, unlike Object Oriented Programming (OOP) where the unit of modularity is a class, in AOP this is called an Aspect, hence Aspect oriented programming. Aspect enable modularization of concerns such as transaction management, RED metrics collection I referred to earlier, etc. that cut across multiple types and objects

### Tools and Libraries used
For collecting metrics from the application we use a library from [DropWizard](http://metrics.dropwizard.io/3.2.2/). Core dropwizard metrics library is added as dependency as shown below
```xml
<!-- drop wizard -->
<dependency>
    <groupId>io.dropwizard.metrics</groupId>
    <artifactId>metrics-core</artifactId>
    <version>${dropwizard-metrics.version}</version>
</dependency>
```
For collecting JVM metrics to get insights into resource consumption, metrics jvm library dependency is added to maven pom.xml as shown below
```xml
<dependency>
    <groupId>io.dropwizard.metrics</groupId>
    <artifactId>metrics-jvm</artifactId>
    <version>${dropwizard-metrics.version}</version>
</dependency>
```
For storing metrics in Graphite, Dropwizard provides a library that includes graphite reporting capabilities. You can pull this dependency into your project by updating your pom.xml as shown below
```xml
<dependency>
    <groupId>io.dropwizard.metrics</groupId>
    <artifactId>metrics-graphite</artifactId>
    <version>${dropwizard-metrics.version}</version>
</dependency>
```
We also use a library [Metrics for Spring](http://metrics.ryantenney.com/) which is a module that integrates dropwizard metrics library with Spring.
```xml
<!-- ryantenney metrics -->
<dependency>
    <groupId>com.ryantenney.metrics</groupId>
    <artifactId>metrics-spring</artifactId>
    <version>3.1.3</version>
</dependency>
```
Additionally to leverage Spring AOP support we will need to add "spring-boot-starter-aop" dependency as shown below
```xml
<!-- Spring AOP + aspectJ -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
    <version>${spring.boot.version}</version>
</dependency>
```
Graphite for storing metrics from microservices and grafana for visualization of these metrics. For the purposes of this blog post I'm running both graphite and grafana in a container and I have created a docker-compose file.

### Metrics Collector Aspect
Annotate class with "@Aspect" to tell Spring AOP Framework that the specific class is an Aspect. In my case I named this class MetricsCollector. This class has a method called "CollectMetrics" which includes an "Around" advice that invokes a PointCut expression that looks for any method that has an "CollectMetrics" annotation. Many AOP frameworks including Spring, model an advice as an interceptor. See the code from the MetricsCollector aspect below.

```java
@Aspect
@Component
public class MetricsCollector {
    private static final Logger LOG = LoggerFactory.getLogger(MetricsCollector.class);

    @Autowired
    private ExtendedMetricRegistry metricRegistry;

    @Pointcut("@annotation(collectMetrics)")
    public void collectable(CollectMetrics collectMetrics){}

    @Around("collectable(collectMetrics)")
    public Object collectMetrics(ProceedingJoinPoint pjp, CollectMetrics collectMetrics) throws Throwable {
        Object targetObject;
        final String methodName = pjp.getSignature().getName();

        // start  timer
        final Timer.Context timerContext = metricRegistry.timer(MetricRegistry.name(methodName, ExtendedMetricRegistry.DURATION)).time();

        //increment total requests meter
        metricRegistry.meter(MetricRegistry.name(methodName, ExtendedMetricRegistry.REQUESTS)).mark();

        try {
            // log arguments
            logArguments(pjp, methodName);
            targetObject = pjp.proceed();
        } finally {
            final long elapsed = timerContext.stop();
            metricRegistry.recordTime(MetricRegistry.name(methodName, metricRegistry.DURATION), elapsed);
        }
        return targetObject;
    }

    @AfterThrowing(value = "@annotation(com.rprakashg.sb.samples.CollectMetrics)", throwing = "e")
    public void handleException(final JoinPoint jp, final Exception e){
        final String methodName = jp.getSignature().getName();
        metricRegistry.meter(MetricRegistry.name(methodName, metricRegistry.ERRORS)).mark();
    }

    private void logArguments(final JoinPoint joinPoint, final String methodName) {
        String arguments = Arrays.toString(joinPoint.getArgs());
        if (LOG.isDebugEnabled()) {
            LOG.debug("Executing method: [ {} ] with arguments: {}. ", methodName, arguments);
        }
    }
}
```
In the code above you can see we are using a Timer for capturing duration of the method call as well as incrementing REQUESTS meter when ever method is called and if any exception is thrown inside the method, ERRORS meter is also incremented. 

For collecting metrics on resource consumption we simply are adding all the JVM metrics. You can see in below code from Spring Application Configuration class that initializes an ExtendedMetricsRegistry which is a simple wrapper class around MetricsRegistry in DropWizard library 

```java
@Configuration
public class ApplicationConfig {
    private ExtendedMetricRegistry emr;

    @Value("${spring.application.name}")
    private String appName;

    @Bean
    public ExtendedMetricRegistry extendedMetricRegistry(final MetricsConfig metricsConfig) {
        emr = new ExtendedMetricRegistry(appName, metricsConfig.getMetricRegistry());
        emr.registerGCMetricSet();
        emr.registerBufferPoolMetricSet();
        emr.registerMemoryUsageGuageSet();
        emr.registerThreadStatesGuageSet();

        return emr;
    }
}
```
To demonstrate the usage of metrics collection I wrote a sample Microservice that uses YAHOO api for looking up stock prices for a specific symbol you pass. To automatically collect RED metrics from any method we can simply add @CollectMetrics(true) annotation as shown below and voila we have metrics :)
```java 
@RestController
public class DemoServiceController {
    private static final Logger LOG = LoggerFactory.getLogger(DemoServiceController.class);

    @Autowired
    private StockQuoteService service;

    @CollectMetrics(true)
    @RequestMapping(value = "/quotes/{tickerSymbol}",
            produces = { "application/json" },
            consumes = { "application/json" },
            method = RequestMethod.GET)
    public ResponseEntity<Quote> getStockQuote(@PathVariable("tickerSymbol") String tickerSymbol)
            throws BackendServiceException{
        Response r = service.getStockQuote(tickerSymbol);

        return new ResponseEntity<>(r.getQuery().getResults().getQuote(), HttpStatus.OK);
    }
}
```
There is also a Dockerfile for containerizing the Java SpringBoot application. Additionally I've included a Docker-Compose file to get the entire stack up and running.

If you are interested in seeing this in action simply clone this repo as shown below

```
git clone https://github.com/rprakashg/metrics-demo.git
```
*Updates 07/03/2017: Updated dockerfile to leverage docker multi stage builds as a result mvn clean install no longer needs to be run*
<del> Swtich directory to metrics-demo/metrics-common and run mvn command below to compile and install the jar in your local maven repo.</del>
```diff
  mvn clean install
```
<del>Next switch the directory to "stock-quote-service" directory under "metrics-demo" and run the same maven command as above.
Change the directory back to "metrics-demo" and simply run the docker-compose command shown below. This will build a container image for stock-quote-service microservice.</del>
Build the stock quote demo service by running the docker-compose command below.

```
docker-compose -f metrics.yml build
```
Run the entire application including graphite and grafana monitoring stack by running following command below.
```
docker-compose -f metrics.yml up
```
### Metrics in Grafana
I ran a few tests from postman against the stock-quote-service API and here is a sample dashboard showing RED metrics in action
![](/images/metrics.jpg?raw=true)

All the code is in this github [repo](https://github.com/rprakashg/metrics-demo) Let me know if you have any comments or feedback.

Cheers,

Ram

