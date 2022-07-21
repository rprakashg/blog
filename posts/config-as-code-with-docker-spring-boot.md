---
title: "Configuration As Code With Docker and Spring Boot"
date: 2017-09-22T09:55:57-07:00
author: "Ram Gopinathan"
published: true
archived: true
categories: ["spring boot", "config as code", "java", "docker"]
tags: ["java", "devops", "microservices", "docker"]
---

## What is Configuration as code?

Configuration as code is a DevOps practice that promotes storing of application configuration as code within source code repository. Few key benefits that this brings is that 

* Versioning of application configuration

    By storing the application configuration in source code repository such as Git allows us to see what configuration changes were made over a period of time and who made those changes

    By using branches you can isolate changes that are under development without affecting the production application 

* Traceability

    Versioned and managed properly, can provide tracking of what version of configuration is deployed in various environments

* Make configuration changes without requiring to re-deploy application

    Operators would love you for this for ex. Operators can throttle logging level up in configuration settings file to troubleshoot a production issue without having to redeploy the application.

## Implementation
Now that we understand what configuration as code is and what benefits it brings let's take a look at how we would implement this with docker and spring boot. Spring boot provides support for keeping configuration settings in "yml" files instead of using a properties files, by default spring boot looks for these "yml" files under classpath but you can specify an explicit location by setting "spring.config.location" property via command line during application startup.

For the purpose of this article we have stored all default configurations for this demo application application.yml file and environment specific settings are stored in application-{environment label}.yml file as shown in screen capture below

![](/images/dzone4.png?raw=true)

Since we are running the spring boot app in docker, we can use an "entrypoint.sh" bash script to pull default configuration and environment specific configuration files from "git" repository onto directory named "configs" as shown below using wget command.

```shell
echo "Downloading configuration files from git repository"
wget  $GIT_REPO/$LABEL/$REL_PATH/$APP_NAME.yml
wget  $GIT_REPO/$LABEL/$REL_PATH/$APP_NAME-$PROFILE.yml

echo "copying yml files to configs directory"
cp $APP_NAME.yml ./configs/$APP_NAME.yml
cp $APP_NAME-$PROFILE.yml ./configs/$APP_NAME-$PROFILE.yml
```

As you can see from the above snippet

* "GIT_REPO" environment variable is used to pass the git repository URL where the configuration files are stored.

* "LABEL" environment variable maps to the branch, in development/test/staging phases you might use "MASTER", when you release it to production you'll want to create a branch and use that branch label. This allows us to isolate changes that are under development from impacting the production application.

* "REL_PATH" environment variable is used to point to the location of configuration files in repo relative to the repository path.

* "APP_NAME" environment variable maps to file name, in the demo app I'm keeping default name "application"

* "PROFILE" environment variable maps to name of environment which the application is running. Spring boot will merge the default settings and environment specific settings and provide it to your application.

(Note: If your git repository requires authentication you can use ssh or HTTPS protocol with username and password to authenticate with the git repository. Docker container can obtain the credentials required to connect to git repository during startup.)

Once the configuration files are downloaded from repository onto "configs" directory in the container we specify this location via application startup using the "spring.config.location" property as shown in below snippet

```shell
exec java $JAVA_OPTS -jar /app.jar --spring.config.location="./configs/$APP_NAME.yml, ./configs/$APP_NAME-$PROFILE.yml"
```

## Running the demo application
Let's now run this demo application with staging settings as shown in command below

```shell
docker run -d -p 80:8080 -e PROFILE=staging -e GIT_REPO="https://raw.githubusercontent.com/rprakashg/blog-demos" \
    -e LABEL=master -e REL_PATH="externalize-config-demo/src/main/resources" \
    -e APP_NAME="application" rprakashg/externalize-config-demo
```
Demo application simply displays the configuration information and you can see from the screen capture below that application has picked up default settings as well as staging environment specific settings.
![](/images/dzone5.png?raw=true)

Let's run the same demo application now with production settings as shown in snippet below.

```shell
docker run -d -p 80:8080 -e PROFILE=production -e GIT_REPO="https://raw.githubusercontent.com/rprakashg/blog-demos" \
    -e LABEL=master -e REL_PATH="externalize-config-demo/src/main/resources" \
    -e APP_NAME="application" rprakashg/externalize-config-demo
```

As you can see from the screen show below that the application now picks up default as well as production specific settings.

![](/images/dzone6.png?raw=true)

## Source Code
All the code for the demo application is available at this github [repository](https://github.com/rprakashg/blog-demos/tree/master/externalize-config-demo)

## Conclusion
Configuration as code is a good practice that all development teams practicing devops should follow. Many of the benefits gained from implementing configuration as code can help increase velocity and deliver new features to your customers in production faster and help operators run and manage application in production efficiently.



