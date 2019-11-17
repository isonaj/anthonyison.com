---
title: Kubernetes Ingress in the wild
image:
tags:
- kubernetes---


Kubernetes ingress is basically the gatekeeper to your cluster services.

Some of the problems I hit:
1. I don't want to terminate the HTTPS at the cluster wall, but at the service
2. *.hostnames are not supported by the ingress spec, but ARE supported by ingress controllers.

## Installing an Ingress Controller


## Ingress routing with *.hostnames


## Terminating your HTTPS connections



