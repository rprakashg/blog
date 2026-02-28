---
date: "2026-02-28"
author: "Ram Gopinathan"
published: true
title: "Automating post install configurations with cloud-init for Red Hat Enterprise Linux deployments on baremetal environments"
categories: ["RHEL", "linux", "os", "cloud-init"]
tags: ["OS", "RHEL", "Linux", "ImageBuilder", "cloud-init"]
archived: false
---

# Automating post install configurations with cloud-init for Red Hat Enterprise Linux deployments on baremetal environments

*Stop configuring servers by hand. Here's how cloud-init brings cloud-level automation to your physical infrastructure.*

---

## What Is cloud-init?

cloud-init is the industry-standard, open-source tool for automating the initial configuration of Linux instances at first boot. Originally designed for cloud virtual machines, it has evolved into a powerful general-purpose provisioning framework that works equally well on bare metal hardware.

At its core, cloud-init reads configuration data from a variety of sources — called "data sources" — and uses that data to configure a system before it is handed off to users or automation pipelines. On a bare metal RHEL system, this means everything from setting the hostname, creating users, injecting SSH keys, configuring networking, mounting disks, and running arbitrary scripts can happen automatically, without a human touching a keyboard.

The tool is deeply integrated into Red Hat Enterprise Linux. It ships in the default RHEL repositories, is supported across RHEL 8 and RHEL 9, and is a first-class citizen in environments managed by Red Hat tools like Satellite, Insights, and Image Builder.

---

## Why Use cloud-init for Bare Metal?

### The Problem with Manual Provisioning

Anyone who has racked and stacked physical servers knows the pain. You image the machine, then spend the next 20–60 minutes repeating the same steps: set the hostname, configure network interfaces, create service accounts, copy SSH keys, harden SSH config, register with Satellite or Subscription Manager, join the monitoring system, run your configuration management agent for the first time. Multiply this by dozens or hundreds of servers and the operational cost — and risk of human error — becomes significant.

Kickstart helps with the OS installation phase, but it has limitations for post-install configuration, particularly when you need dynamic values (IP addresses, hostnames, certificates) or want to separate concerns between the OS image and the instance-specific configuration.

### cloud-init Fills the Gap

cloud-init sits at the intersection of OS installation and configuration management. It handles the "Day 0" and "Day 1" configuration that happens between "the OS is installed" and "the server is ready for its workload." This makes it complementary to tools like Ansible or Puppet, not a replacement — it gets the node to a state where those tools can take over cleanly.

For bare metal RHEL specifically, cloud-init solves several real problems:

**Immutable base images.** You can build a single, hardened, approved RHEL image and stamp it onto any server. Instance-specific configuration never touches the base image — it flows in through cloud-init at boot time. This means your image stays consistent and auditable.

**Dynamic environments.** Data centers change. IP addresses, hostnames, certificates, and registration tokens change between deployments. cloud-init accepts this data at boot rather than baking it in, so your image doesn't need to be rebuilt every time an environment variable changes.

**Speed at scale.** When you need to provision 50 servers for a new workload, the difference between 45 minutes of manual work per server and a fully automated boot-time configuration is measured in days, not hours.

**Auditability.** cloud-init logs everything it does to `/var/log/cloud-init.log` and `/var/log/cloud-init-output.log`. You get a complete, timestamped record of what happened during provisioning — invaluable for compliance and troubleshooting.

---

## How cloud-init Works on Bare Metal RHEL

### The Boot Sequence

cloud-init runs as a set of systemd services during the early boot process, broken into four stages:

1. **cloud-init-local** — Runs before networking is up. Handles local data sources and network configuration.
2. **cloud-init** — Runs after networking is available. Fetches remote configuration data.
3. **cloud-config** — Applies the configuration defined in cloud-config user data (the main configuration stage).
4. **cloud-final** — Runs last-minute tasks: executing scripts, running configuration management agents, sending final notifications.

This staged approach means cloud-init can safely configure networking before needing the network, and can defer tasks that require connectivity until after the network is confirmed available.

### Data Sources for Bare Metal

In cloud environments, data sources are obvious: AWS metadata service, Azure IMDS, GCP metadata server. On bare metal, you have several options:

**NoCloud** is the most common for bare metal. It reads configuration from a local filesystem (an ISO image, a USB drive, or a directory) or from a URL. You can pass the URL via kernel command line parameters (`ds=nocloud-net;seedfrom=http://your-server/`), making this very amenable to PXE-booted environments.

**HTTP/URL-based data sources** work well when you have a provisioning service — such as a Foreman/Satellite instance or a custom metadata service — that can serve per-host configuration dynamically based on MAC address or other identifiers.

**Kickstart integration** is a natural fit for RHEL. You can use Kickstart to handle disk partitioning and OS installation, then hand off to cloud-init for post-install configuration by embedding a NoCloud seed or URL reference in the `%post` section.

### Configuration Format: meta-data

When using NoCloud datasource in cloud-init, the meta-data file is one of the core components that provides instance identity and basic configuration to the VM during first boot. The meta-data file defines instance-level identity information. It is required for NoCloud datasource. 
It typically lives alongside:
* user-data
* (optional) network-config

All are placed in an ISO labeled cidata or a directory mounted as seed data or passed via kernel parameters

At a minimum following values are required for meta-data

```yaml
instance-id: "<unique identifier for instance>"
local-hostname: vpac-rhel-node01
```

### Configuration Format: cloud-config

The primary configuration format is YAML, beginning with the `#cloud-config` header. Here is an example showing common bare metal provisioning tasks:

```yaml
#cloud-config

# Set the hostname
hostname: vpac-rhel-node01
fqdn: vpac-rhel-node01.example.com
manage_etc_hosts: true

# Create users and inject SSH keys
users:
  - name: admin
    groups: wheel
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-ed25519 AAAA...your-public-key

# Write configuration files
write_files:
  - path: /etc/sysconfig/network-scripts/ifcfg-eth1
    content: |
      TYPE=Ethernet
      BOOTPROTO=static
      IPADDR=10.0.1.100
      NETMASK=255.255.255.0
      GATEWAY=10.0.1.1
      ONBOOT=yes

# Install or remove packages
packages:
  - insights-client
  - rhc
  - firewalld

package_update: true

# Run commands at first boot
runcmd:
  - rhc connect --organization <your-org-id> --activation-key <your-activation-key>
  - insights-client --register
  - systemctl enable --now firewalld
  - firewall-cmd --permanent --add-service=ssh
  - firewall-cmd --reload
```

### Integrating with PXE and Network Boot

The most powerful bare metal workflow pairs PXE boot with cloud-init. The sequence looks like this:

1. Server PXE boots from your TFTP/HTTP server.
2. Kickstart (or Anaconda) installs RHEL onto the local disk.
3. On first real boot, cloud-init runs and fetches configuration from your provisioning service — keyed to the server's MAC address or hostname.
4. The provisioning service returns a tailored cloud-config payload for that specific machine.
5. cloud-init applies the configuration, registers with Satellite, runs your baseline Ansible playbook, and signals completion.
6. The server is ready.

This entire sequence, from PXE boot to a fully configured, registered, and monitored server, can complete in under 15 minutes with no human interaction.

### Using cloud-init with Red Hat Satellite

Red Hat Satellite 6.x and later have native cloud-init integration. Satellite can serve as a cloud-init data source, delivering host-specific configuration including subscription registration, content view assignment, and activation keys. When combined with Satellite's discovery and provisioning workflows, you get a fully automated bare metal provisioning pipeline that is also connected to your subscription management and patch lifecycle.

---

## Key Benefits at a Glance

**Consistency.** Every server gets exactly the same configuration process. Drift introduced by manual steps is eliminated. The configuration is defined in version-controlled YAML, not in someone's runbook or memory.

**Speed.** What took an hour of manual work per server becomes a 10–15 minute automated process. At scale, this is transformative.

**Separation of concerns.** Your OS image team maintains the base image. Your operations team maintains the cloud-config. Environment-specific values (hostnames, IPs, activation keys) are data, not code. These three things change independently without stepping on each other.

**Cloud portability.** If you run workloads both on bare metal RHEL and in a cloud environment (AWS, Azure, GCP), the same cloud-config format works everywhere. You write your provisioning logic once and it runs on any infrastructure.

**Auditability and compliance.** cloud-init's detailed logs give you a timestamped record of every action taken during provisioning. Combined with version-controlled cloud-config files, you can prove exactly what configuration was applied to any server at any point in time.

**Integration with the Red Hat ecosystem.** cloud-init integrates cleanly with Satellite, Insights, Image Builder, and Red Hat's activation key and subscription management systems. It is not a workaround — it is part of the intended provisioning story for RHEL.

---

## Getting Started

Installing cloud-init on RHEL is straightforward:

```bash
dnf install cloud-init
systemctl enable cloud-init-local cloud-init cloud-config cloud-final
```

For a bare metal test, create a NoCloud seed directory with your `user-data` and `meta-data` files, package it as an ISO, and attach it to your server. On the next boot, cloud-init will read and apply your configuration.

From there, the path to a fully automated provisioning pipeline is incremental: integrate with your PXE environment, connect your provisioning service as a dynamic data source, layer in Satellite for subscription and content management, and add your configuration management tooling as a `runcmd` step.

---

I've automated the entire process of building an ISO with custom kickstart to generating a cloud init seed iso using Ansible. You can find these roles in this ansible collection [here](https://github.com/rprakashg/vpac)
* [Create ISO Installer](https://github.com/rprakashg/vpac/tree/main/roles/create_image_installer): This role automates creation of an ISO installer using image definition you have defined for Red Hat Enterprise Linux deployments
* [Create ISO installer with custom kickstart](https://github.com/rprakashg/vpac/tree/main/roles/inject_ks_into_iso)
* [Create Cloud Init Seed ISO](https://github.com/rprakashg/vpac/tree/main/roles/create_cloudinit_iso) 

## Conclusion

cloud-init is not just a cloud technology that has been bolted onto bare metal as an afterthought. For RHEL environments, it is the right tool for the gap between OS installation and application readiness — consistent, auditable, fast, and deeply integrated with the Red Hat ecosystem. If you are still configuring bare metal servers by hand, cloud-init is worth evaluating. The investment in your initial configuration templates pays back quickly, and the operational consistency it brings has compounding value as your environment grows.
