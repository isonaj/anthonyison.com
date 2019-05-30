---
title: 'Kubernetes: Setting up a cluster on AKS'
tags: kubernetes
cover_img:
feature_img:
description:
keywords:
---
Each time I come back to look at Kubernetes, I feel like I've forgotten something (or everything). This post is a cheat sheet for getting up and running.

# Getting ready
Firstly, let's install the latest Azure CLI. Check [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) for the latest version. Run `az --version` to see what version you have if you have it installed already. Next, `az login` and `az account set -s <subscriptionId>` so that you're ready to go.

# Create the cluster
Create the resource group: (location is important. some areas have no AKS support yet eg. australiasoutheast)
```
az group create --name myResourceGroup --location australiaeast
```

Create the AKS cluster:
```
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster
    --node-count 1 \
    --generate-ssh-keys
```
Connect to the cluster:  (install kubectl if you haven't already with `az aks install-cli`)
```
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```
Connect to the Kubernetes Dashboard:
```
az aks browse --resource-group myResourceGroup --name myAKSCluster
```
## Windows Nodes (NEW)
For Windows nodes:  (not working yet)
Start with: `az extension add --name aks-preview`
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

az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --os-type Windows \
    --name npwin \
    --node-count 1 \
    --kubernetes-version 1.14.0
```

# Extras
## Helm
choco install helm?
## Linkerd
https://channel9.msdn.com/Shows/Azure-Friday/60-seconds-to-a-Linkerd-service-mesh-on-AKS?ocid=AID747781&wt.mc_id=CFID0461


Resources:
* https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough
