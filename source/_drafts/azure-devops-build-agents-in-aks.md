---
title: Azure DevOps Build Agents in AKS
tags:
image:
feature_img:
description:
keywords:
---

Had some issues recently with builds on site so tried to go off site.

## Create the AKS Cluster
I've covered this before [here](), but let's do a quick flyover.

Great docs here:
https://docs.microsoft.com/en-us/azure/aks/windows-container-cli
I've been using the windows preview for a while and I needed to update my Azure CLI and the feature with 
```sh
$ az extension update --name aks-preview
```

With AKS, I must have a Linux node and I can't remove it later. As such, I want something small that I can mess around with for other experiments, but mostly I want to keep those costs down. For a linux build server, I would probably add a more beefy node pool later.

Spun up a new AKS cluster with:
```sh
$ az aks create --resource-group AKSCluster --name AKSCluster --node-count 1 --kubernetes-version 1.14.8 --generate-ssh-keys --windows-admin-password My5up3rSecur3P@ssw0rd! --windows-admin-username isonajadmin --vm-set-type VirtualMachineScaleSets --load-balancer-sku standard --network-plugin azure --node-vm-size Standard_B2s --node-osdisk-size 32
```

Added a windows nodepool with:
```sh
$ az aks nodepool add --resource-group AKSCluster --cluster-name AKSCluster --os-type Windows --name winbld --node-count 1 --kubernetes-version 1.14.8 --node-vm-size Standard_D4s_v3
```
> The nodepool name is limited to 6 characters. 

The default node size is Standard_D2s_v3 (2 core, 8 Gb ram).

## Create the Windows Build Agent Image

There seems to be an image for Linux build agents, but not Windows. There are great instructions [here](https://blog.ehn.nu/2019/01/creating-a-windows-container-build-agent-for-azure-pipelines/). Incidentally, the author, [Jakob Ehn](https://blog.ehn.nu/about-me/), also gave a great talk at NDC, [Keeping your builds green with Docker](https://www.youtube.com/watch?v=ekNSwDS1ya4).

I have pretty much cloned [Jakob's Github repo](https://github.com/jakobehn/WindowsContainerBuildImage) for the Windows Build Agent config.

I have to tweak a few things to get this to work (like remove webdeploy). 

```sh
$ docker build -t isonaj/win-build .
$ docker run -d -e TFS_URL=https://dev.azure.com/<yourOrg> -e TFS_PAT=<yourAccessToken> -e TFS_POOL_NAME=<poolName> -e TFS_AGENT_NAME=<agentName> isonaj/win-build
```

Next, I need to check the image kernel and the node kernel are compatible. I can check the version of Windows Server on my node pool with:
```sh
$ kubectl get nodes

NAME                                STATUS   ROLES   AGE   VERSION
aks-nodepool1-35867168-vmss000000   Ready    agent   74m   v1.14.8
akswinbld000000                     Ready    agent   57m   v1.14.8

$ kubectl describe node/akswinbld000000

<snipped>
System Info:
 Machine ID:                 akswinbld000000
 System UUID:
 Boot ID:
 Kernel Version:             10.0.17763.737
 OS Image:                   Windows Server 2019 Datacenter
 Operating System:           windows
<snipped>
```

That looks like Windows Server 2019 to me. Now I run:
```
$ docker inspect mcr.microsoft.com/dotnet/framework/sdk:4.8-windowsservercore-ltsc2019

<snipped>
"Architecture": "amd64",
"Os": "windows",
"OsVersion": "10.0.17763.805",
<snipped>
```

They are close, but not exact. Since it's only the build number that's changed, we can run this image on the AKS node. I have updated the Dockerfile to use this image as the base. 







ALSO!
https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/docker?view=azure-devops
Simpler Windows build agent, but downloads all tools?