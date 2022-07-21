---
title: "Going to production with Google Kubernetes Engine (GKE)"
date: 2019-09-02T08:13:37-07:00
author: Ram Gopinathan
published: false
archived: true
categories: ["gke"]
tags: ["cloud", "gke", "google", "microservices", "devops"]
---
We all know managing kubernetes platform is complex and as an enterprise our goal is to have our developers be focussed on building features and enhancements that provide value to our customers who use our products and services. Less time that we can focus on kubernetes infrastructure the better we will be in terms of doing things that make our customers happy. If you look across the industry cloud providers and vendors are all solving this complexity problem by providing managed services for running and operating kubernetes platform.  For instance Google provides [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) aka GKE, Amazon has [Elastic Kubernetes Service](https://aws.amazon.com/eks/) aka EKS, Azure has [Azure Kubernetes Service](https://azure.microsoft.com/en-us/services/kubernetes-service/) aka AKS, Pivotal now VMWare has [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service) aka PKS and OpenShift, IBM, Oracle and many more vendors in the public cloud space providing similar solutions. This is going to be 8 part blog series where I will cover how to go from zero to production with Google Kubernetes Engine.

* **Part 1:** Account Setup 

    This post we will go deep into your GCP account level setup to ensure we are starting off on a solid foundation.

* **Part 2:** Up and running with Google Kubernetes Engine

    This post will go deep into provisioning a production ready GKE cluster

* **Part 3:** Securing your Google Kubernetes Engine 

    Now that you have a production grade GKE cluster stood up for deploying your workloads, in this post we will go deep into securing your GKE cluster

* **Part 4:** Monitoring your Google Kubernetes Engine

    This post we will go deep into configuring logging and monitoring for your cluster. We are going to cover some choices and decisions you will have to make with respect to Open Source solutions v/s Integration with other Google services like StackDriver. This allows you to make sure you can move to other managed services or perhaps your own without locking into anything provider specific

* **Part 5:** Autoscaling your Google Kubernetes Engine Cluster and PODs

    This post will cover configuring auto scaling for your cluster and configuring auto scaling for your application PODs

* **Part 6:** Administering your Google Kubernetes Engine Cluster

    This post will cover administration activities such as Upgrading, Resizing clusters, Backup and Recovery, Understanding Resource Usage, Configuring Kubectl access etc.

* **Part 7:** Enhancing platform services 

    Kubernetes by itself is not sufficient to run real world workloads, there are lot of open source and vendor solutions for things like Service Mesh, Running different types of databases, Helm, etc. This post will cover things you might chose to install on top of your GKE cluster to enhance platform capabilities as well as support your workload requirements

* **Part 8:** Deploying workloads to your Google Kubernetes Engine Cluster

    At this point you have a production ready kubernetes cluster that is ready for workloads to be deployed, in this post we will cover how to go from source to container to cluster


I'm planning to do a similar post with EKS and AKS, hopefully it will help anyone who is looking to leverage these services and personally I'm also curious to learn moving between these managed services mainly from a platform standpoint. Workloads since we are building for K8s abstraction you automatically get the portability so I'm not too concerned about that. 

Let me know your thoughts or comments in reply below also if you like me to cover anything else I might be missing

Thanks,

Ram
