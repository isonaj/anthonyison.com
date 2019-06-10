---
title: 'Kubernetes: AKS and Windows Containers'
tags:
  - Kubernetes
image: >-
  /kubernetes-aks-and-windows-containers/small_vidar-nordli-mathisen-667388-unsplash.jpg
feature_img: vidar-nordli-mathisen-667388-unsplash.jpg
date: 2019-06-10 14:52:07
description:
keywords:
---

When I first heard about Windows containers, I got really excited by the idea of packaging ASP.Net legacy apps and ASP.Net Core apps consistently, without the need to remote into a VM and apply extra libraries. I soon found that Windows containers were quickly followed by a "yeah, but". Windows node support has recently been added to Kubernetes and AKS. I don't think it's quite ready for production, but it sure does look promising.

# Why use Windows Containers?
Firstly, we need to realise that Windows ain't Windows. There are 2 types of windows containers: 
* Windows Server Core
* Nano Server

## Windows Server Core
Windows Server Core is mostly your standard Windows Server. If you're running .Net Framework services, you're looking here. Unfortunately, the containers are HUGE! (~~12 gig~~ 5 gig for a container)  That said, it's come a long way in the last few years. Overall, I like Windows Server Core because it allows legacy .Net Framework applications to be packaged and deployed in modern ways and these are the applications that usually really need it.

## Nano Server
Nano Server solves the bloat problem with the Windows containers, coming in at a more respectable 300-ish megs, which is really exciting! "Yeah, but" it doesn't support .Net framework. SO it's pretty much for .Net Core projects. The problem with this is .Net Core projects really SHOULD target Linux instead. There are use cases for Nano Server, such as combining .Net Framework and .Net Core projects together on a single windows server. So, if you absolutely MUST run on Windows, Nano server has your back, though I would consider this a last resort option.

# The problem with Windows containers
I've already said that I don't think Windows containers are quite ready for production. This is mostly due to [Windows container compatibility](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility). Without Hyper-V, which is not yet supported in Kubernetes, a windows container will only run on a matching host OS version. This means your host OS and container OS needs to be matched (which isn't too bad, I guess), but it also means they should be upgraded at the same time. ie. Upgrade the Windows OS on your nodes and watch your current services fail to start.

# Use them anyway
To be honest, I'm inclined to start using Windows containers anyway. Windows Server 2019 is out. Hyper-V is coming to Kubernetes. I'm expecting Microsoft to have a migration path available soon. Realistically, it will be a while before the Host OS is upgrading and I'm expecting these issues to be solved by then. Either way, I think it's close enough that I'm prepared to look a lot closer, perhaps even as far as a staging environment.

## Create a Cluster in AKS
> This requires: `az extension add --name aks-preview` to work.

Create the cluster: 
NOTE: Password must be min 12 chars, and have Uppercase, Lowercase, numeric and Special chars
```
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --enable-addons monitoring \
    --kubernetes-version 1.14.0 \
    --generate-ssh-keys \
    --windows-admin-password $PASSWORD_WIN \
    --windows-admin-username azureuser \
    --enable-vmss \
    --network-plugin azure
```
## Create Windows nodepool
```
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --os-type Windows \
    --name npwin \
    --node-count 1 \
    --kubernetes-version 1.14.0
```

## Pods (Windows containers) 
Right, let's create a Pod. Of course, normally you would create a pod with a Deployment object, but we're just testing things out.

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: basiccorewin-pod
  labels:
    app: basiccorewin
spec:
  containers:
  - name: basiccorewin
    image: isonaj/basiccorewin:1803
    ports:
    - containerPort: 80
  nodeSelector:
    beta.kubernetes.io/os: windows
```

## My Windows Pod won't start
The Windows pod has been created and applied, but it won't start correctly. Instead, `kubectl get pods` is showing the pod in a RunContainerError state. Have a closer look by running `kubectl describe pod <podName>`. You're looking for 'Failed to start container' and the error message following. If it is 'The container operating system does not match the host operating system' then you have a Host OS/Container OS version mismatch.

> The container operating system does not match the host operating system.

So, I ran `kubectl describe node <nodepool>` and saw that my host OS is 10.0.17763.379 (which is 1809). For the container, run `docker inspect isonaj/basiccorewin:1803` and look for OsVersion. This shows my container OS version to be 10.0.17134.766 (which is version 1803). To resolve this situation, I built a new container with an OS that matches the host I want to run on. (1809)

# Summary
I don't think Windows containers are quite production ready, but I think they're getting pretty close to what I need. If you can match the container versions to the version of the host they will be deployed to, they seem to run quite happily. I think it's worth getting used to putting .Net Framework applications into containers and even hosting in staging. I don't think it will be long before they're ready for production.