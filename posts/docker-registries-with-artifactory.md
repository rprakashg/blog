---
date: "2017-05-07T10:51:09-07:00"
author: "Ram Gopinathan"
title: "Some thoughts on running docker registries in jFrog artifactory"
tags: ["docker", "artifactory", "registry", "discovery"]
categories: ["docker", "artifactory"]
published: true
archived: true
---

At T-Mobile we use jFrog [artifactory](https://www.jfrog.com/artifactory/) as a centralized repository for storing artifacts. It is one of the key tools in our DevOps toolset and is integrated into our CI/CD processes. Artifactory has support for storing docker images in repositories, essentially its like running private docker registries. 
Artifactory lets you create multiple docker repositories which is pretty nice for a large company like T-Mobile where there are numerous groups developing dockerized microservices, each group can have thier own repository (registry in docker terminology) with right level of access control that governs who can push images into it.

If you are using Artifactory for hosting private Docker registries in enterprise, below are few things to keep in mind. Later I will cover how we have addressed these. 

* Discovering images that are stored in multiple repositories

    With flexibility of running multiple docker registries, discovering images becomes bit of a challenge, artifactory web portal has some nice search functionality built in which helps, but if you are in docker cli you have to know the name of the repository before you can search or pull the image down

* Governing Use of Docker Images from Docker Hub

    Docker hub is public registry where thousands of open source developers and ISVs are publishing docker images for thier products. In the enterprise it becomes critical to ensure the use of appropriate images for production deployment. You don't want a group by mistake use an image that has security vulnerabilities or is not certified by docker to run well on docker platforms. The new docker store addresses some of these challenges enterprises face but governing use of docker images for production still is a critical things every enterprise needs to ensure.

* Promoting docker images to release registry

    One of the policies we have is any docker image deployed to our production Mesos stack has to come from release repository in artifactory. Only the service account used by Jenkins job has rights to push to release registry. For those who might be new to Artifactory, when you create docker repository in Artifactory, artifactory creates "*-snapshot-local" and "*-release-local" repositories. Snapshot is where images that are still in development stored, before a docker image is deployed to production they get promoted to release repository. Another benefit with this model is that you can have seperate retention policies for images stored in these repos, for ex. We have a default 15 day retention policy for anything in Snapshot, you can request to increase this. Obviously images in release repo has unlimited retention

## How did we address the above three things
For the first bullet point, we use a virtual docker repository that aggregates images from all docker repositories in artifactory. Few benefits of doing this is that

1. It Provides a single endpoint for developers to resolve images from docker registries in artifactory. This is huge in the enterprise, think about in the past if you needed to reuse something another group had built, I can tell you it almost never happens, there are many reasons for this which I wont get in to but in summary lots of duplication of effort is what ends up happening. Containerization movement within our company and use of Docker and Artifactory is really changing how teams work, there is less duplication, developers can build/push images into docker registries in artifactory and other developers inside and outside of their respective groups can discover and use these images avoiding duplication of efforts etc. 

2. The other key benefit is IT operators can manage these docker registries such as moving/consolidating images or modify include and exclude patterns to enfore security policies without worrying about impacting developers.

For the second bullet point we are using remote repository which is seeded with approved images for production use from docker hub. Virtual repository also aggregates images from remote repository freeing developers to ever needing to pull any image from docker hub.

For the third bullet point we use docker tagging in Jenkins job to promote images that are ready for production deployment from snapshot to release.

Jenkins job first we pull the image from snapshot registry as shown below...

```
docker pull {artifactory host}/{docker snapshot registry}/{image name}:{tag} 

```
Next we use docker tagging to include release registry as shown below

```
docker tag {artifactory host}/{docker snapshot registry}/{image name}:{tag} {artifactory host}/{docker release registry}/{image name}:{tag}
```
Lastly we use docker push to promote the image to release registry

```
docker push artifactory host}/{docker release registry}/{image name}:{tag}
```

Below is a diagram that shows how we use artifactory for hosting private docker registries

![artifactory structure](http://rprakashg.github.io/images/artifactory.jpg)