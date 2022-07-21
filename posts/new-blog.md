---
date: "2017-04-23T19:48:26-07:00"
author: "Ram Gopinathan"
title: "New blog"
tags: ["aws", "s3", "cloudfront", "hugo", "website", "hosting"]
categories: ["website", "hugo"]
published: true
archived: true
---

## Why changing the blogging platform
There is two main reasons why I switched hugo for blogging.

- Speed (No more dynamic rendering of pages based on content stored in databases)
- Cost

Hugo gives me freedom from needing any runtimes or databases which equates to speed since the entire site is just plain old HTML generated out of markdown files. Additionally my current wordpress blog hosted on Azure with ClearDB is running out of space available for free tier and is requiring me to upgrade to paid membership.

I wanted to author blog posts using markdown format, VisualStudio Code provides great support for markdown authoring. Posts authored in markdown format are stored in a github [repository](http://github.com/rprakashg/blog). Additionally I needed a continous publishing process that builds the site using hugo and publishes generated content when ever changes are committed to github repository.

## Hosting platform
For hosting I decided to use AWS S3 with Cloudfront which gives me low cost storage and global content delivery.

## Provisioning AWS components
Creating a new site and configuring it for blog was pretty easy and straightforward, I'm not going to go into details as there is plenty of articles and even documentation available at [gohugo.io](http://gohugo.io) site how ever I ran into some challenges with S3 + Cloudfront hosting. I came across a [sample template](https://s3-us-west-2.amazonaws.com/cloudformation-templates-us-west-2/S3_Website_With_CloudFront_Distribution.template) for S3 hosting but quickly ran into few limitations

1. After I setup continuous publishing from Travis-CI I was getting access denied when accessing items in the bucket even though the bucket had public read enabled, this is primarily due to the fact that there is no concept of inheriting permissions in S3. I ended up having to create a bucket policy that granted read access to everything in the bucket to everyone
2. Since one of my goal with this move was to setup continous publishing from Travis-CI when ever changes are committed to the github repository, it required me to create an AWS IAM user with full rights to S3 bucket hosting the content, additionally I needed to invalidate the cloudfront distribution when ever changes are published to the S3 bucket so user's can see fresh content, this required few cloudfront specific permissions granted to the user.

Because of the reasons mentioned above and a few other flexibilities I was looking for, I ended up creating a custom cloudformation template. You can find the template [here](http://github.com/rprakashg/cf-templates). If you want to leverage hugo for hosting your blog or other types of sites along with S3 + Cloudfront for hosting and content delivery, you will find this template very useful as it will get you almost 98% of the way. Once stack is created using the template you can simply copy the nameservers from the hosted zone created and update your domain settings in godaddy or what ever hosting provider you use.

## Creating the stack
After you clone the [repo](http://github.com/rprakashg/cf-templates), simply change the default template parameter values in template.parameters.json file to match your needs. Script uses AWS cli create-stack command to create the stack. If you are using OSX you can run command below to create the stack

~~~
./create-stack.sh
~~~

Once the stack is created successfully simply login to your AWS console and navigate to Route 53 hosted zone that was created by the cloudformation template and copy the name servers list and update your domain settings and replace nameservers with the one's you copied from the hosted zone recordset

## Deleting stack
I've also included a simple script to delete the stack, script will grab the stack name from template.parameters.json file and deletes the stack using AWS cli delete-stack command. Run command below to delete stack

```
./delete-stack.sh
```

## Continuous publishing
As mentioned earlier one of my goal was to continuously publish to S3 bucket when new content or changes to existing content are committed to github repository. I'm using Travis-CI for this. If you are not familiar with Travis head over to [Travis-CI.org](http://travis-ci.org) for more info. 

See my [.travis.yml](http://github.com/rprakashg/blog/blob/master/.travis.yml) for reference.

As you can see from my travis file I install hugo, then generate site content by running hugo command in script section. For deploying to S3 I'm using the S3 deployment support available in Travis-CI. For more information please [see](https://docs.travis-ci.com/user/deployment/s3/). I've also added AWS Credential ID and Secret Key for the IAM build user that gets created as a part of creating the stack using the cloudformation template. AWS Credentials are stored encrypted. For more information on adding encrypted environment variables [see](https://docs.travis-ci.com/user/environment-variables/#Defining-encrypted-variables-in-.travis.yml). Finally after successfully publishing content we invalidate cloudfront distribution by running a script. Download the cloudfront invalidation script [here](https://github.com/rprakashg/blog/blob/master/cdn-invalidate.sh). Big thanks to [Ben Whaley](https://www.whaletech.co/about/) for the cloudfront invalidation script.


