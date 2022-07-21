---
date: "2017-06-10T10:03:20-07:00"
author: Ram Gopinathan
published: false
archived: true
title: "Setup prometheus on AWS using elastic beanstalk and docker"
---

# Overview
In this post I will walkthrough how you can setup a monitoring stack that includes [Prometheus](http://prometheus.io) as monitoring server and [Grafana](http://grafana.com) for creating beautiful charts and monitoring dashboards and Prometheus Push Gateway so applications that prometheus server cannot reach can simply push their metrics into the gateway where Prometheus server would scrape all the metrics off of. My assumption is you are familiar with Prometheus, Grafana, Docker and Elastic Beanstalk service within AWS as I won't go too much into it, instead the key focus will be mostly on docker support within Elastic Beanstalk specifically multi container applications. 

## Multi Container Docker platform support in Elastic Beanstack
If your application has more than one container, Elastic beanstalk allows us to create an environment where you can run multiple containers. Elastic beanstalk is integrated with ECS and all aspects of ECS is taken care of for you including cluster creation, task definition and execution which is pretty cool if you ask me. Monitoring stack we are going to setup involves three containers

* Grafana 
* Prometheus
* Push gateway (for applications to push metrics to Prometheus)

Diagram below shows a high level architecture for our monitoring stack.
![](/images/mon-post.jpg?raw=true)

### Dockerrun.aws.json
Multi container apps on elastic beanstalk requires you to create a configuration JSON file called Dockerrun.aws.json file. This file is specific to elastic beanstalk but is very similar to docker compose file which is used for composing multi container applications. Version 1 is used when you want launch a single container and Version 2 is used for multi container apps. Since our monitoring stack involved more than 1 container we will go with version 2. Below you can see the Dockerrun.aws.json file we are going to need for provisioning this monitoring stack.

We are going to define three volumes in our Dockerrun.aws.json file. 

* "prometheus-conf" : Prometheus configuration file will be stored and read from this volume by prometheus server


```
"volumes": [
        {
            "name": "prometheus-conf",
            "host": {
                "sourcePath": "/var/app/current/prometheus"
            }
        },
        {
            "name": "prometheus-data",
            "host": {
                "sourcePath": "/data/prometheus"
            }
        },
        {
            "name": "prometheus-gateway-data",
            "host": {
                "sourcePath": "/data/prometheus_gateway"
            }
        }
    ]
```

### Testing Locally
To test this locally you simply run following command in eb cli
```
eb local run
```
What even cool is when you run the above command, it automatically creates a docker-compose.yml file in ".elasticbeanstalk" directory for testing your multi container application.

## Deploying the stack to elastic beanstalk

### Install elastic beanstalk CLI
Since we are going to be interacting with elastic beanstalk service, we will install the elastic beanstalk CLI first by running command below

```
pip install --upgrade --user awsebcli
```

### Create an elastic beanstalk application
Run commands below to create an elastic beanstalk application

```
mkdir prometheus
cd prometheus
eb init
```

### Create an elastic beanstalk environment
Using a pre-defined configuration create an elastic beanstalk environment by running command shown below.

```
eb create prometheus --cfg prometheus --profile {name}
```

## Summary
This is a real good option for teams that are building microservices and need a good monitoring stack for collecting metrics from these services as well as visualizing them. This approach allows teams to be self sufficient rather than be dependant on other teams that own/provide centralized monitoring solution. Obviously if your centralized monitoring solution is using Prometheus, prometheus does support scrapping metrics from other prometheus servers so you can have all the metrics in a centralized monitoring stack which will enable you to create wholistic view across the entire services topology

Hope this helps,

Ram Gopinathan
