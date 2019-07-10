---
title: 'Kubernetes: Setting up a cluster on AKS'
tags: kubernetes
date: 2019-06-04 22:45:12
image: /kubernetes-setting-up-a-cluster-on-aks/small_cover.jpg
feature_img: cover.jpg
description:
keywords:
---
Most cloud providers provide a managed Kubernetes cluster at this point. Each time I come back to look at Kubernetes, I feel like I've forgotten something (or everything). This post is a cheat sheet for getting a cluster up and running on Azure (using AKS) with recommended extras.  

# Creating a Cluster
## Getting ready
Firstly, let's install the latest Azure CLI. Check [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) for the latest version. Run `az --version` to see what version you have if you have it installed already. Next, `az login` and `az account set -s <subscriptionId>` so that you're ready to go.

Create the resource group: (location is important. some areas have no AKS support yet eg. australiasoutheast)
```bash
$ az group create --name myResourceGroup --location australiaeast
```

## Create a Linux-only cluster
Create the AKS cluster:
```bash
$az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --enable-addons monitoring \
    --generate-ssh-keys
```

## Connect kubectl to your cluster
Install latest kubectl using `az aks install-cli`. (You may need to update your path to find the correct kubectl.exe)

```bash
$ az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

Connect to the Kubernetes Dashboard:
```bash
$ az aks browse --resource-group myResourceGroup --name myAKSCluster
```
If you get permissions errors (due to RBAC), you can give cluster-admin permissions with:
```bash
$ kubectl create clusterrolebinding kubernetes-dashboard \
    -n kube-system --clusterrole=cluster-admin \
    --serviceaccount=kube-system:kubernetes-dashboard
```
