---
title: Creating a blog with Ghost
date: 2019-05-01 20:17:17
tags: 
---
There seems to come a time in a software developer's life where you look at creating a blog. It's that time for me. I want a place where I can write up some of my experiments for later reference, and if that can help others along the way, all the better!
# Considerations
1. I don't want to pay anything. I really don't want to break the bank with this project. If I can pay nothing, I will. This puts [Azure](https://azure.com) squarely in the front seat because I have $70 a month to spend there.
2. Easy to use. I don't want to spend ages messing with this project, or debugging issues.
3. Broad application / reusable. It would be great if this thing can be used for more than just this blog. If I can host other sites or blogs on the same infrastructure, that would be kinda handy.
4. Preferably something I want to learn. Cause, you know. What's the point otherwise?

At first, I had thought I'd be using [Wordpress](https://wordpress.org) and I wasn't really looking forward to that. On the upside, there are wordpress containers around and I was pretty keen to run it in a container.

After a quick email with [Thiago](https://passos.com.au), I started looking at [Ghost](https://ghost.org). Once I knew it was there, I noticed that many of the blogs I read, including [Troy Hunt](https://www.troyhunt.com), are powered by Ghost. With little more than that meagre planning, it was time to get started.
# Attempt 1: Azure Web apps
Firstly, I needed a place to host it. I'm an Azure guy, so I started there. It seemed to be straight forward enough. A ghost container, wrapped in a Web App, running on Linux, volume mapped to a Azure File storage. I ran it locally and it worked perfectly. Once installed on Azure, I found the database just wouldn't load up correctly, giving Migration errors, saying that the database was locked.

First attempt foiled!
# Attempt 2: Google GKE
My next attempt was to spin it up on GKE on to [Google cloud](https://cloud.google.com). [Kubernetes](https://kubernetes.io) seemed to be a bit of overkill for what I was trying, but Google made that super easy, and it pretty much "just worked".

That left me with the question, what about AKS on Azure?
# Attempt 3: Azure AKS
I've never created an AKS cluster. I mean, I've wanted to. Who hasn't? The thing is, I've never actually clicked the Go button. So, I guess it's time. It was easy enough to configure as well and then I clicked Create and waited. I waited and then I waited some more. I went looking for any events showing that something was happening, but couldn't see anything. So I tried again and this time, it worked.

It spun up easy enough and with minor changes to the PersistentVolumeClaim, it just worked as well, albeit it a bit slower than GKE, which was odd because I had double the resources on Azure.
# So, now what?
Alright, so now I seem to be on the kubernetes train. Even writing it now, it seems kinda crazy to spin up a kubernetes cluster to run a blog that is probably only going to have me as traffic. But it is expandable. There are a couple of sites I want to host. They're currently in containers on Azure Web apps, but should move across easy enough.

I'm still not sure of cost. I will run both solutions for a couple of days and have a look at what charges come through. I hadn't planned to move from Azure at this time. That's where I have the most experience.
# Next steps
1. Run some performance and pricing measures to compare GKE vs AKS and decide where my blog will stay.
2. Write up the technical steps for creating the blog.
3. Enable the site to run [HTTPS](https://www.troyhunt.com/the-6-step-happy-path-to-https/) with [Let's Encrypt](https://letsencrypt.org) certificates.