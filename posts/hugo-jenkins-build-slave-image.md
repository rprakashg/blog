---
title: "Jenkins Build Slave Image For Building Hugo Projects"
date: 2017-07-07T22:44:01-07:00
author: "Ram Gopinathan"
published: true
archived: true
categories: ["jenkins", "docker", "hugo"]
tags: ["jenkins", "docker", "hugo"]
---
# Overview
At T-Mobile we are starting to leverage [Hugo](http://gohugo.io) which is an OSS static site generator tool for a few marketing type of sites. We are also huge Jenkins shop and run jenkins build slaves in docker and Mesos/Marathon. We use S3 bucket for hosting content generated, cloudfront for global content delivery and route 53 for DNS. I've created a docker jenkins build slave image for building hugo projects in Jenkins. Image comes preloaded with Hugo and AWS CLI along with S3Cmd utility that is typically used for syncing content to S3 bucket.

If you are using Hugo and Jenkins you'll find this image useful. Image is available in docker hub. You can run command below to pull the image down to your docker host that your are using with Jenkins. If you have any issues and or comments or questions let me know.
```
docker pull rprakashg/hugo-jenkins-build-slave
```

Git repository for this image is [here](http://github.com/rprakashg/hugo-jenkins-build-slave)

Cheers,

Ram

