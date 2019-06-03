---
title: 'Kubernetes: A Beginner''s Guide'
tags: kubernetes
cover_img:
feature_img:
description:
keywords:
---
Kubernetes is a container orchestration platform and has been described as "the OS of the cloud". It builds on container-based services by providing many features such as volumes for stateful services, resilience and scaling, monitoring, automated zero-downtime upgrades. It runs on a cluster of nodes (VMs) and allocates services to nodes based on either hard limits (eg. my service must run on linux) and prioritised preferences (eg. put these two services on the same VM). If you are running your services in containers, Kubernetes will likely make your life easier.

# Containers
The first important step is to ensure your software is running in a container. A container is a way of packaging your service, along with any dependencies, removing the reliance of specific libraries, etc existing on the OS. I'm mostly assuming you know what a container is, what the benefits are and how to run one in this blog post.

# Components
A Kubernetes system provides a number of components that you can use to produce a solution. It is important to know what components are available and what problems each component sets out to solve. We will look at each component in turn to understand what value is provided.

Components are created by pushing YAML to the API service (eg. with `kubectl`). The YAML will define the state that you WANT the system to have and the API (and other services) will decide what changes are needed and then apply those changes.

In this post, we will look at the building blocks needed to get a simple service running in kubernetes. 

## Nodes
A node represents an underlying machine (eg. VM). They are an important part of the Kubernetes eco system, since you wouldn't have a cluster without them. Nodes can be queried and managed in much the same way as other components of the system. Since the purpose of this talk is to abstract away the underlying hardware, OS and libs, we'll leave it there. 

## Pods
Pods are the basic building blocks of a Kubernetes system and it's probably fair to say everything else supports Pods in keeping their services running and available. A Pod runs one or more containers and defines ports, volumes, config settings, etc to expose a container service.

To create a pod:
```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: basiccore-pod
  labels:
    app: web
spec:
  containers:
    name: basiccore
    image: isonaj/basiccore
    ports:
      - 80
```

## ReplicaSets

## Services
A service is a way of exposing your Pod to the outside world. Since there can be multiple containers serving the same workload, we need a load balancer to assign incoming requests to pods. Well, that's a service. 

To create a service:
```yaml

```




Intermediate???

## Ingress
An ingress component represents a front facing load balancer and is often provided by the underlying cloud service. In essence, this allows you to compose various services into a seamless API.

## Volumes
At some point, you will probably want to keep some data around. A volume provides different styles of storage to your Pod.

To create a volume: 
```yaml

```

## ConfigMaps
A ConfigMap is a key-value pair that can also store files. The values of the ConfigMap can be passed into a container 
Since a change to config can take a service out of action, updating a ConfigMap will produce a zero-downtime rollout in much the same way as an upgrade to the container

## Secrets
A Secret is very similar to a ConfigMap and are also key-value pairs that may also store files. The main point of difference is that Secrets are encypted when stored and are designed for holding sensitive data, such as ConnectionStrings, Passwords and Certificates. 

## Deployments

