---
date: "2022-07-25"
author: "Ram Gopinathan"
published: true
title: "Eight reasons why I would build my digital applications platform on OpenShift"
categories: ["Platform"]
tags: ["OpenShift", "Platform", "Kubernetes", "Digital"]
archived: false
---

A good solid digital applications platform is the foundation of any successful Digital Transformation and Application Modernization initiatives. Large enterprises often invest in this area as they embark on these initiatives. In this post, I wanted to talk about my top eight reasons why I would build my digital applications platform on OpenShift. Just to be clear these aren't listed in any order of priority, they are just my 8 reasons. In later articles I'm going to deep dive into each with demos that showcase the capabilities I'm talking about here.

**1) Enterprise ready kubernetes**

A good foundation is a key to the success of any enterprise digital application platform. OpenShift runs on a lightweight container optimized version of Red Hat Enterprise Linus (RHEL) called Red Hat Enterprise Linux CoreOS (RHCOS). RHCOS ships with a container runtime called CRI-O which facilitates running, stopping, and restarting containers. It fully replaces the docker container engine which was used in OpenShift 3.x versions. RHCOS also ships with a set of container tools for managing containers. Controlled immutability of RHCOS allows OpenShift to store the latest state of RHCOS systems so it's always able to create additional machines and perform updates based on the latest RHCOS configurations. An enterprise ready kubernetes is layered on top of RHCOS to provide a solid foundation upon which customers can build their digital application platform.

**2) Secure and Compliant**

Who doesn't want a compliant and secure platform? Being compliant with industry and enterprise standards is critical to the success of any enterprise digital applications platform. There are a lot of features in OpenShift related to security and compliance and we aren't going to go into details for each, here are a few things that I think are quite useful IMO.

**AuthN & Authorization:**

An Enterprise application platform has users with varying roles and responsibilities. Here are a few examples of user personas for a kubernetes based enterprise application platform.

> **Cluster Administrator:** Responsible for Managing and Operating the cluster

> **Developers:** Develop and Test applications

> **Operators:** Manage and Monitor applications

In addition to the above roles, it's a good practice to do all deployments to staging and production environments with a service account.

If your team is responsible for providing platform services for the entire enterprise Authentication and Authorization (RBAC) is one of the key things that you will need to take care of as you roll out the platform within the enterprise. To help with this OpenShift comes with a built-in OAuth server, you can integrate with external identity providers that support oidc auth flows that your organization might be using. Users and their roles and responsibilities can still be defined in the external identity provider which can be mapped to roles within Openshift to allow operations that can be performed on the platform based on roles.

**Compliance Checking:**

Meeting compliance requirements are a necessary part of running a digital applications platform for the entire enterprise. Here are some of the major compliance frameworks relevant to containerized applications:
    
> **CIS Benchmarks for Kubernetes and Docker:** Developed by Center for Internet Security.

> **NIST SP 800-190:** One of the many cybersecurity compliance frameworks published by the National Institute of Standards and Technology

> **PCI:** Payment Card Industry (PCI) framework covers organizations that store, process or transmit customer's payment information and is developed in partnership with five major credit card companies

> **HIPAA:** Technological safeguards to the HIPAA act address how organizations collect, process, or transmit individually identifiable electronic protected health information of a patient.
    
Organizations require to prove to a third party that applications are continually secure. Meeting compliance requirements can be more challenging than simply securing the application. It involves tracking and keeping records that prove continual compliance. While compliance can be challenging failing to meet compliance standards can be even more expensive.

OpenShift comes with a compliance operator that can run compliance scans and recommends remediation actions. From a tooling perspective operators can use oc-compliance plugin with OpenShift cli (oc) to interact with the compliance operator. Compliance operator leverages OpenScap which is a NIST certified tool to scan and enforce security policies. Out of the box we give you a set of compliance profiles that represent different compliance benchmarks. If you want to learn more, check out this [link](https://docs.openshift.com/container-platform/4.10/security/compliance_operator/compliance-operator-understanding.html)

**File Integrity Checking:**

OpenShift provides a File Integrity Operator that can continually run file integrity checks on the nodes in a cluster and provide a log of files that have been modified. This can be beneficial for tracking and monitoring any unauthorized file modifications by bad actors.

**Container Security:**

A secure and highly available container registry is one of the components that should be a part of your enterprise application platform efforts. Container images of all applications running on the platform should come from this registry. Good practice to have guard rails set up on the platform that would only allow container images from an approved container registry and restrict images from public repositories. From a security and governance perspective, this is very important. 

OpenShift provides quay which is a highly available container registry. Quay can be installed on OpenShift using the Quay operator. OpenShift cluster administrator can install Quay operator directly from the operator hub. Quay also provides container image vulnerability scanning using Clair. You can configure clair to periodically scan container images stored in quay registry. Results from the image vulnerability scans can be used to identify vulnerable images and necessary remediation actions can be taken with the respective teams. Quay can also mirror any external image repositories that your organization might be using. As your organization moves more towards containerization some of the images might come from external sources and by mirroring those repositories in quay you can govern the usage of third-party images in your organization.

Red Hat also provides and maintains a set of base container images for the operating system and language runtimes that application teams can use as an optimal starting point to build their application container images. For more information please check out this [article](https://developers.redhat.com/products/rhel/ubi)  

**3) Cluster Monitoring**

Cluster monitoring is critical to running a production grade enterprise application platform. OpenShift comes out of the box with a monitoring stack based on Prometheus and Grafana that has all the best practices baked into it. This is one of the infrastructure workloads that can be run on infrastructure nodes in an OpenShift cluster this way customers can save the OpenShift worker cores they purchase to run their workloads.

**4) Managed Cloud Services**

If you are running workloads in the cloud quite honestly speaking I just don't see why a customer would prefer to have a digital applications platform that they self-manage. 
OpenShift dedicated gives you the same OpenShift experience in the cloud provider of your choice without all the headaches of managing it. Quite honestly speaking from a developer perspective as long as I'm building on an enterprise platform whether it's self managed or managed service is not going to be something I'd care much about as long as the experience of build/test/deploy and operate remains the same. OpenShift is also available as a native service in Azure (ARO) and AWS (ROSA). If you want to learn more about different managed cloud services offering for OpenShift, please [visit](https://www.redhat.com/en/technologies/cloud-computing/openshift)

**5) Choice of Running the platform where you want**

This is super important. Most companies are now deploying workloads on multiple public clouds, on-premises sites, and even on the edge and if I'm responsible for providing platform services for the entire company choice of running where I want to run my platform will be super critical otherwise as a platform provider I have to invest a lot in maintaining skillset within the team for public clouds, on-premises, etc. You also have other concerns like developer experience. Most developers are now deploying workloads to multiple on-premises sites as well as in multiple clouds and you want them to have a consistent experience developing, testing, and deploying applications on the platform. Openshift provides you this choice, whether you are an operator or a developer regardless of where you are running your platform you have the same consistent experience. You don't need to learn new tools, methods, etc. 
 
**6) Cost Management**

Understanding and managing costs for your enterprise application platform is critical to the success of any enterprise platform.

OpenShift provides a cost management service which allows customers to better understand cost associated with OpenShift across your hybdrid infrastructure from high level down to specific projects, departments and regions. It helps you visualize, understand and, analyze resource usage. You can map charges to projects, departments and regions through tagging. Identify patterns in spending. Improve communications with your customers by sharing real usage data. Cost models can be created and can be used to generate showback data.

Cost Management is available as a SaaS service for OpenShift customers and is included with your OpenShift subscription.

**7) Make your developers contribute code on Day 1**

In today's modern cloud-native application development paradigm resource requirements for development environments are considerably higher than ever before and it's not always financially feasible to give all the developers laptops with enough CPU, RAM, SSD storage so they can be productive. In addition to this enterprise developers spend a considerable amount of time setting up their development environments with IDE and all the required tools they need so that they can develop and test applications that are deployed to kubernetes based environment. Openshift provides CodeReady workspaces that can address some of the challenges we discussed earlier. CodeReady workspaces are essentially development environments in the cloud. Developers use a browser to access their development environment and login with their credentials just as they would on a real laptop and start working on tasks assigned to them on day 1 without having to spend a considerable amount of time getting their development environments ready. We hope that enterprise developers can start committing code on day 1

**8) Leveraging the benefits of the digital platform on day 1**

A digital application platform must be viewed as a tool to achieve digital transformation, app modernization goals but the reality is it's going to be a journey that takes time, especially when you look at it broadly as a whole enterprise. So the question comes how do I leverage the platform investments now. OpenShift provides a capability called OpenShift virtualization which allows you to simply migrate your legacy workload running on a VM to OpenShift and simultaneously work on transformation initiatives. This allows customers to leverage platform investments on day 1.

As always reach out to me if you have any questions or comments about this post. 

Thanks,
Ram
