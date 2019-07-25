---
title: Getting Started with Progressive Web Apps
tags:
- PWA
image:
feature_img:
description:
keywords:
---
This topic has been on my list of things to do for almost 6 months now and one of the great benefits I've found from blogging is that I will get drawn into any topic I start a blog post on. Writing about a topic is a great way to get motivated to learn it.

# What are Progressive Web Apps?
A Progressive Web App (PWA) is a web page that uses modern APIs to provide almost native experience through some of the following features:
* Instant Load
* Work Offline
* Add to Homescreen
* App Install Banner
* Push Notification
* Background Sync

It needs to be Fast, Integrated, Reliable and Engaging and will blur the lines between visiting a web page and installing an app, as we will see later in this post.

## Getting Started
The key parts of a PWA are Instant Load, Work Offline and Add to Homescreen. We need to understand two key features to deliver these and they are Service Workers and the Cache API.

### Service Workers
Service workers are an important part of Progressive Web Applications and sit between the page and the internet. They have no access to the DOM or localStorage, but they can access cache and intercept requests. This gives the application choice on whether to return a cached response or request an external response. The cache allows the application to continue to function, even without internet access.

## Adding PWA to your Angular app
PWA functionality can be quickly added to an Angular application with:
```bash
$ ng add @angular/pwa --project-name <project-name>
$ ng g service-worker
```


## Creating an App Shell
In order to load quickly, we need to have a core application (inlined html, js and css) that should download and execute very quickly, that can bootstrap the rest of the web application.


#### Static caching

### Dynamic cacching

### Web App Manifest

### App Install banner


