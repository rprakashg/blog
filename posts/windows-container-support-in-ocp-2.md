---
date: "2024-03-30"
author: "Ram Gopinathan"
published: false
title: "Using persistent storage in windows containers"
categories: ["openshift", "redhat"]
tags: ["containers", "platform", "kubernetes", "openshift", "redhat", "windows", "microsoft"]
archived: false
---
This post is `Part 2 of a 4 part series on deep dive into windows container support in OpenShift container platform. Here is a full list of what's covered

* [Part 1](/windows-container-support-in-ocp-1) we are going to cover how to enable windows container support and add windows nodes onto cluster. We are also going to deploy a sample application to test 

* [Part 2](/windows-container-support-in-ocp-2) which is this post we are going to cover using persistent storage and go over some of the usecases and scenarios that you might run into in real world

* [Part 3](/windows-container-support-in-ocp-3) we are going to cover autoscaling windows workloads specifically custom metrics autoscaler as HPA and VPA is still not supported for windows containers yet. We are also going to cover scaling windows machineset

* [Part 4](/windows-container-support-in-ocp-4) we are going to cover monitoring and observability options for windows workloads. We will examine some of the gaps that exist today for windows workloads and some approaches to address these gaps

### Driver Prerequisites
Windows CSI driver daemonset pods aren't deployed to windows nodes by default. Cluster administrator must deploy the appropriate windows csi driver daemonset. 


#### CSI driver installation instructions for windows nodes

### Storage options on Amazon

#### Amazon EFS
Mounting EFS volumes into windows containers are not supported. Amazon EFS csi driver isn't compatible with windows containers.

#### Amazon Elastic Block Storage (EBS)
You can mount an EBS volume as filesystem storage for windows containers. Few things to understand here are dynamic provisioning is not supported which means you have to pre-provision EBS volume and then create a [`PersistentVolume`](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) resource and bind to the EBS volume you want to use. See an example below

```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: ebs-pv
spec:
  storageClassName: ebs-windows-sc
  capacity: 
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  csi:
    fsType: xfs
    driver: ebs.csi.aws.com
    volumeHandle: vol-01a4ac828e2164337
  allowedTopologies:
  - matchLabelExpressions:
    - key: topology.ebs.csi.aws.com/zone
      values:
      - us-west-2a
```

EBS volumes can only be mounted if access mode is ReadWrite this makes it only ideal for use with single deployment/pod. Makes a great demo workshop but don't see actual use in real world for mounting as file storage.

Hope this helps,

Ram
