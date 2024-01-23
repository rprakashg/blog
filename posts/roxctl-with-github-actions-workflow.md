---
date: "2024-01-23"
author: "Ram Gopinathan"
published: true
title: "Running roxctl commands from github actions workflows"
categories: ["Platform"]
tags: ["RHACS", "RedHat", "Developer", "Tools", "Github" ]
archived: false
---

If you are a kubernetes developer and you are using Github and Red Hat Advanced Cluster Security for kubernetes, you are going to find yourselves having to run roxctl from your CICD pipelines. If you are not familiar with `roxctl`, it's is a command line utility provided with Red Hat Advanced Cluster security for Kubernetes. These tools aren't installed on github runners by default and you are going to have to download and install this yourself within your CICD pipelines. I found myself doing this over and over for various demos I worked on and decided to write a custom action to do just that. 

[Here](https://github.com/rprakashg-redhat/setup-roxctl) is the Github repository for the setup-roxctl action. 

Usage

```yaml
- uses: github.com/rprakashg-redhat/setup-roxctl@main
  with:
    # Version of roxctl to be downloaded
    # Default: latest
    version: ""
```

This action is written in typescript and will download platform specific version of the roxctl cli. Input to this action is version which is optional. If you do not specify any value the action will download the latest version of roxctl cli. Below are few sample usage Scenarios 

Download latest version
```yaml
- uses: rprakashg-redhat/setup-roxctl@main
  with:
    version: "latest"
```

Download specific version (4.3.4)
```yaml
- uses: rprakashg-redhat/setup-roxctl@main
  with:
    version: "4.3.4"
```

I've included an example workflow in the repo where you can see the action live. Below you can find the full yaml for the workflow.
```yaml
name: example
on:
  workflow_dispatch:
    inputs:
      version:
        description: Version of roxctl to setup
        type: string
        default: "latest"
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: setup roxctl
        id: setup-roxctl
        uses: ./
        with:
          version: ${{ inputs.version }}
      - name: verify
        run: |
          ./roxctl version
          ./roxctl help
```

Check out the [output](https://github.com/rprakashg-redhat/setup-roxctl/actions/runs/7632384910/job/20792494029) from the most recent run for the example to see this in a live environment

Hope this helps,

As always please reach out to me if you have any questions about this post via any of the contact methods listed here.

Thanks,
Ram
