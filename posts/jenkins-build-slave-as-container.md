---
title: "Using docker for dynamically provisioning jenkins build slaves and running build jobs"
date: 2017-07-07T23:49:22-07:00
published: true
archived: true
categories: ["jenkins", "docker"]
tags: ["jenkins", "docker"]
---

# Why?
In Many enterprises leveraging Jenkins for running automated builds, it's quite common to have a central team providing Jenkins and other CI/CD tools as shared service. One of the issues that you quickly run into is that each development group within enterprise may have different platforms, frameworks, tools, libraries etc and to support the needs of everyone you end up provisioning jenkins build slaves for each group installing everything a particular group needs to be able to build/run jenkins jobs on these Jenkins slave nodes. Depending on number of groups you are supporting, this can get pretty difficult to manage. Thankfully for docker and the Jenkins community there is a docker plugin for Jenkins that can be used to dynamically provision a build slave as a docker container running on a remote docker host, run the build job and tear it down at the end of it. There a numerous benefits with this approach. 

1. Each development group can build the slave docker image according to their specification and through a CI process build/push the image to a docker registry keeping full ownership within the development team itself. No need to file any requests to get the tools you need installed on jenkins build slaves before your can create your CI/CD processes
2. From an Operator's perspective you now have less number of build slaves to manage, preferably zero. I know our teams goal is to get to zero build slaves with fully dockerized approach.

Here are the steps you can perform to leverage docker for dynamically provisioning a build slave as container:

* Install Docker Plugin 
* Enable Docker Remote API on docker host 
* Create a Docker image for Jenkins build slave
* Configure Jenkins
* Creating Jenkins job to run on docker

## Install Docker Plugin
For the purposes of this post I installed a single node Jenkins server using Vagrant, I won't go too much into how I setup Jenkins as its all well documented and pretty easy to get setup. To install the docker plugin, login to Jenkins console and click on manage jenkins and from manage jenkins click on manage plugins. Switch to the available tab and you can scroll down or use the filter to find the docker plugin, select it to install. You may need to restart jenkins server for changes to get in effect.

## Enable Docker Remote API on docker host
This is important step, plugin communicates with Docker via remote rest API which is turned off by default. You can enable it by simply adding below options to your dockerd startup
```
-H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock
```
For the purposes of this demo I installed docker on centos/7 using Vagrant, if you installed docker on centos/7 you can update /usr/lib/systemd/system/docker.service file, look for ExecStart=/usr/bin/dockerd and add above options to dockerd. Restart docker by running commands below
```
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## Create a Docker image for Jenkins build slave
First thing to keep in mind here is depending on the platform that you are using to build your application, choose an appropriate base image, there are lots of base images available for Java, Golang, Node etc. If none fits the bill start from scratch and add everything you need to it. Docker image should also have following: 

1. SSH server installed
2. OpenJDK
3. User that you can use to login with, typically "jenkins"

Docker image should also expose port 22 for SSH and start sshd service when container is run. See an example Dockerfile that I use to create a jenkins slave image for running Hugo builds

```
FROM golang:1.8.3-alpine

MAINTAINER Ramprakash.Gopinathan@t-mobile.com

ENV HUGO_VERSION 0.25
ENV HUGO_BINARY hugo_${HUGO_VERSION}_linux-64bit
ENV PATH=/usr/local/hugo:${PATH}

RUN set -x \
    && apk --no-cache update \
    && apk --no-cache upgrade \
    && apk --no-cache add git bash curl openssh python python-dev py-pip py-pygments openjdk8 wget\
    && ssh-keygen -A \
    && rm -rf /var/cache/apk/* \
    && adduser -D jenkins \
    && echo "jenkins:jenkins" | chpasswd \
    && mkdir -p /var/run/sshd \
    && mkdir /usr/local/hugo \
    && wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY}.tar.gz -O /usr/local/hugo/${HUGO_BINARY}.tar.gz \
    && tar xzf /usr/local/hugo/${HUGO_BINARY}.tar.gz -C /usr/local/hugo/ \
	&& rm /usr/local/hugo/${HUGO_BINARY}.tar.gz \
    && pip install --upgrade pip \
    && pip install awscli \
    && git clone https://github.com/s3tools/s3cmd.git /opt/s3cmd \
    && ln -s /opt/s3cmd/s3cmd /usr/bin/s3cmd 

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
```
Build the docker image and publish to your internal private docker registry, this allows you to login to your private registry from Docker host and pull the image down. You could always run docker save command to create a tar ball and scp this to docker host and run docker load to get the image on to the docker host. 

## Configure Jenkins
We now need configure Jenkins to use Docker for dynamically provisioning slave as containers on docker host. Login to your Jenkins console and click on "Manage Jenkins" option. From manage jenkins click on "Configure System" option and scroll all the way to the bottom of the page.
Under "Cloud" section click on "Add a new cloud" button. If the plugin is installed correctly you will see "Docker" option as shown below.

![](/images/jenkins3.jpg?raw=true)

Enter information about your docker host. As I mentioned earlier I setup a docker host using vagrant for the purposes of this demo and created an entry in my /etc/hosts file to map the IP address of the VM to docker.local. You can test to make sure Jenkins server is able to talk to docker host by clicking on "Test Connection" button. See screenshot below:

![](/images/jenkins4.jpg?raw=true)

Next enter image information such as full image name, Labels and credential to connect to the slave, this will be the user we created in docker file for the slave image. Labels allow us to restrict the builds. See screenshot below. I've added the java image "evarga/jenkins-slave" and the one I've created for running hugo builds, see more on that [here](https://goo.gl/5ecm2V)

![](/images/jenkins5.jpg?raw=true)

## Creating jenkins job to run on docker
At this point you are ready to run your build jobs on docker. Simply configure your job and specify Label Expression use docker as shown below.

![](/images/jenkins6.jpg?raw=true)

Hope this helps, As usual any comments or questions please use the disqus option below

Cheers,
Ram
