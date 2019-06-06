---
title: 'Kubernetes: AKS and Windows Containers'
tags:
image:
feature_img:
description:
keywords:
---


## Create a Cluster to include Windows Nodes (NEW)
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
### Create Windows nodepool
```
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --os-type Windows \
    --name npwin \
    --node-count 1 \
    --kubernetes-version 1.14.0
```


## OPTIONAL - Pods (Windows containers) 
If you've installed a Windows server in your cluster, things can get a little complicated. The thing is Windows ain't Windows. You need to ensure the Host OS is the same version as the Container OS and these are released twice a year.
So, I ran `kubectl describe node <nodepool>` and saw that my host OS is 10.0.17763.379 (which is 1809). For the container, I start it with `docker run isonaj/basiccorewin -d` and then attach a command prompt with `docker exec -it <containerId> cmd` This shows the container OS version at the top: 10.0.17134.766 (which is version 1803). At this point, I need to upgrade my laptop, because I can't pull an 1809 image. My system is 10.0.17134.766 (1803). I can't run a windows version later than my host.

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
    image: isonaj/basiccorewin
    ports:
    - containerPort: 80
  nodeSelector:
    beta.kubernetes.io/os: windows
```


FOR SETTING UP A CLUSTER????

# Extras
## Helm
choco install helm?
## Linkerd
https://channel9.msdn.com/Shows/Azure-Friday/60-seconds-to-a-Linkerd-service-mesh-on-AKS?ocid=AID747781&wt.mc_id=CFID0461


# Resources:
* https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough
