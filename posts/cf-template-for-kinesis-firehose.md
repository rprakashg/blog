---
date: "2017-06-27T06:42:03-07:00"
published: true
title: "Cloudformation template for provisioning firehose with S3 delivery"
categories: ["resources"]
tags: ["cloud", "cloudformation", "aws", "kinesis", "firehose"]
archived: true
---

# Overview
Kinesis firehose is a managed service within AWS that can be used to capture streaming data and load it into Kinesis Analytics, S3, Amazon Redshift or Amazon ElasticSearch services. I've published a cloudformation template that automates provisioning of all required components for Kinesis Firehose with AWS S3 delivery on your AWS account. You can find more info about the cloudformation template [here](https://github.com/rprakashg/cf-templates/tree/master/firehose-with-s3-destination)

One thing I should point out is one of the thing template does is it provisions a KMS key which is used to encrypt/decrypt data ingested at REST. If you want to give others access to read this data from S3 in addition to granting read access to S3 bucket you'll also need to grant DECRYPT permission in your KMS key policy. I din't add this into the template because I don't think it would be good idea to allow decrypt permission to all by default. So depending on your use case if you need to allow consuming applications read access to this data you will need to modify the KMS key policy and grant 'Decrypt' permission as shown below

```
{
    "Sid": "Allow decrypt",
    "Effect": "Allow",
    "Principal": {
        //include service or principal depending on your usecase
    },
    "Action": "kms:Decrypt",
    "Resource": "*"
}
```

Hope that helps.

Cheers,

Ram
