---
title: "Dockerizing Hugo Sites"
date: 2017-11-11T09:25:58-08:00
published: true
archived: true
categories: ["hugo", "docker", "blog"]
tags: ["hugo", "docker", "blog"]
---

Hugo is a great OSS project that can be used to create static sites that are based on markdown files stored in a git repository. My personal blog is created using hugo and hosted on AWS S3. I recently did some work to dockerize it and thought I'd write about it. 

First thing I needed to do was create a docker image with hugo installed so I can build my hugo site. For more info on the docker image see the Dockerfile contents below, you can also check out the git repository [here](https://github.com/rprakashg/hugo-docker). As you can see from the below snippet, nothing major is going on here, I'm using golang alpine image as a base and then installing hugo and adding hugo to the system path.

```
FROM golang:1.8.3-alpine

ENV HUGO_VERSION 0.25 
ENV HUGO_BINARY hugo_${HUGO_VERSION}_linux-64bit 
ENV PATH=/usr/local/hugo:${PATH}

RUN set -x \
    && apk upgrade --update \
    && apk add --update ca-certificates bash curl wget \
    && rm -rf /var/cache/apk/* \
    && mkdir /usr/local/hugo \
    && wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY}.tar.gz -O /usr/local/hugo/${HUGO_BINARY}.tar.gz \
    && tar xzf /usr/local/hugo/${HUGO_BINARY}.tar.gz -C /usr/local/hugo/ \
  && rm /usr/local/hugo/${HUGO_BINARY}.tar.gz \
    && rm -rf /tmp/* /var/cache/apk/* 
```

In my Dockerfile for my personal hugo based blog I use multi stage builds feature in docker to generate static HTML using hugo. As you can see from below snipped that I'm using the "hugo-docker" image I created as builder image and create a directory named "blog" under /var/www/ and copy all files into that directory. 

```
FROM rprakashg/hugo-docker as builder

RUN mkdir -p /var/www/blog

COPY . /var/www/blog
```

Next, we switch the working directory to "/var/www/blog" and run hugo command as shown in below snippet to generate the static HTML

```
WORKDIR /var/www/blog

RUN hugo
```

Final image is built using the official nginx image from docker hub and we copy all generated HTML content from "public" folder into "/usr/share/nginx/html"

```
FROM nginx

COPY --from=builder /var/www/blog/public/ /usr/share/nginx/html
```

You can see the full docker file [here](https://raw.githubusercontent.com/rprakashg/blog/master/Dockerfile)

Lastly, I threw together couple of helpful bash scripts that I can use to build and run the container so I don't have to always remember the docker commands :)

The cool thing about this is I can now run my blog anywhere, I use to host my blog previously in azure with Wordpress and MySQL, by using hugo I freed myself from dependency to web servers, runtimes, databases etc. but was still dependant on AWS S3 to host the generated static HTML content. Even though its pretty minor you are sort of locked into AWS. Docker gives me freedom to run it anywhere and I love it :)


Hope that helps...

Cheers,

Ram 