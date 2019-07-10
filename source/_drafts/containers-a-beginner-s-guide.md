---
title: 'Containers: A Beginner''s Guide'
tags:
- containers
image: /containers-a-beginner-s-guide/small_cover.jpg
feature_img: cover.jpg
description:
keywords: containers, docker
---
In [previous posts](/kubernetes-a-beginner-s-guide), I brushed quickly over containers thinking that everyone knows about them by now. I wanted to get into the meat of Kubernetes. After a few discussions, I've realised that containers are not common knowledge and you need to understand containers before container orchestrators. But first, how did we get here?

# History
> It's a warm summer evening in ancient Greece - [Sheldon Cooper](https://bigbangtrans.wordpress.com/series-3-episode-10-the-gorilla-experiment/)
In the early 2000s, we were all going crazy over a new technology. VMWare released virtual machines, which allowed you to run a system inside a system. Instead of installing an operating system on a drive, you could install it to an image file. Then, you could start run an instance of the image, connect to it remotely and install and run applications. Three big benefits of virtual machines were:
1. Break up your existing server into components that can be easily migrated to different machines (eg. email, ftp, web)
2. Two virtual machines could run different versions of software (no dependencies between VMs)
3. You can easily reset the system to a known state (clone the image)

# Containers
In 2013, [Docker](https://en.wikipedia.org/wiki/Docker_(software)) developed containers, which are like virtual machines with a single shared operating system kernel. This means images are smaller, often much smaller, and the individual instance consume significantly fewer resources.

## Images and Repositories

## Getting an Image

## Running an Container

## Volumes

## Building an Image
The images are layered
Built up by a Dockerfile, each statement produces a new layer

## Multi Stage Builds


