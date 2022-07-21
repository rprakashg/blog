---
title: "Automatically get latest Docker security vulnerabilities posted to slack channel"
date: 2017-10-24T23:24:56-07:00
author: "Ram Gopinathan"
published: true
archived: true
categories: ["security", "docker"]
tags: ["docker", "cve", "security", "slack"]
---

It's extremely important to always be aware of all the announcements related to security issues for the products you use and support within your company, If you use [slack](https://slack.com/) we can have all these announcements posted directly to a slack channel. In this post, I will go over how we can do just that for Docker.

# Approach
You can get a list of known security vulnerabilities using [www.cvedetails.com](http://www.cvedetails.com) website. Known security vulnerabilities can be searched by the vendor, product, version etc. 
Below RSS feed will provide you all known security vulnerabilities for Docker
http://www.cvedetails.com/vulnerability-feed.php?vendor_id=13534&orderby=3&cvssscoremin=0

If you want to further filter down by specific product or version you can simply add "product_id" and/or "version_id" to the query string. To find the product id or version id [www.cvedetails.com](http://www.cvedetails.com) site provides product search and version search capabilities, once you have found the product through the search capability you can simply copy the product id and/or version id from the address bar in your browser and include it in the query string for above RSS feed URL

From the above RSS feed URL vendor id "13534" is for Docker. 

Create a slack channel named "docker" in your slack workspace where we can post all security vulnerabilities related to Docker as well as have all docker related discussions.

Copy the above RSS URL and issue following command in the slack channel. 
```bash
/feed subscribe http://www.cvedetails.com/vulnerability-feed.php?vendor_id=13534&orderby=3&cvssscoremin=0
```
Before you subscribe to RSS feed verify that it's not already subscribed by issuing command below which will list out all the RSS feeds that are already subscribed
```bash
/feed list
```

Once you receive an announcement you should evaluate it and if you are affected by it patch or mitigate the risk, test it and notify everyone.

Hope this helps...

Cheers,
Ram


