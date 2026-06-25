---
title: "Creating a blog with Ghost"
slug: "creating-a-blog-with-ghost"
publishedAt: "2019-01-08T05:13:00.000Z"
updatedAt: "2020-01-11T05:16:13.000Z"
tags:
  - "azure"
  - "blogging"
  - "ghost"
featureImage: "__GHOST_URL__/content/images/2020/01/cover.jpg"
type: "post"
---

<p>There seems to come a time in a software developer's life where you look at creating a blog. It's that time for me. I want a place where I can write up some of my experiments for later reference<!-- more -->, and if that can help others along the way, all the better!</p>
<h2 id="considerations">Considerations</h2>
<ol>
<li>I don't want to pay anything. I really don't want to break the bank with this project. If I can pay nothing, I will. This puts <a href="https://azure.com">Azure</a> squarely in the front seat because I have $70 a month to spend there.</li>
<li>Easy to use. I don't want to spend ages messing with this project, or debugging issues.</li>
<li>Broad application / reusable. It would be great if this thing can be used for more than just this blog. If I can host other sites or blogs on the same infrastructure, that would be kinda handy.</li>
<li>Preferably something I want to learn. Cause, you know. What's the point otherwise?</li>
</ol>
<p>At first, I had thought I'd be using <a href="https://wordpress.org">Wordpress</a> and I wasn't really looking forward to that. On the upside, there are wordpress containers around and I was pretty keen to run it in a container.</p>
<p>After a quick email with <a href="https://passos.com.au">Thiago</a>, I started looking at <a href="https://ghost.org">Ghost</a>. Once I knew it was there, I noticed that many of the blogs I read, including <a href="https://www.troyhunt.com">Troy Hunt</a>, are powered by Ghost. With little more than that meagre planning, it was time to get started.</p>
<h2 id="attempt1azurewebapps">Attempt 1: Azure Web apps</h2>
<p>Firstly, I needed a place to host it. I'm an Azure guy, so I started there. It seemed to be straight forward enough. A ghost container, wrapped in a Web App, running on Linux, volume mapped to a Azure File storage. I ran it locally and it worked perfectly. Once installed on Azure, I found the database just wouldn't load up correctly, giving Migration errors, saying that the database was locked.</p>
<p>First attempt foiled!</p>
<h2 id="attempt2googlegke">Attempt 2: Google GKE</h2>
<p>My next attempt was to spin it up on GKE on to <a href="https://cloud.google.com">Google cloud</a>. <a href="https://kubernetes.io">Kubernetes</a> seemed to be a bit of overkill for what I was trying, but Google made that super easy, and it pretty much &quot;just worked&quot;.</p>
<p>That left me with the question, what about AKS on Azure?</p>
<h2 id="attempt3azureaks">Attempt 3: Azure AKS</h2>
<p>I've never created an AKS cluster. I mean, I've wanted to. Who hasn't? The thing is, I've never actually clicked the Go button. So, I guess it's time. It was easy enough to configure as well and then I clicked Create and waited. I waited and then I waited some more. I went looking for any events showing that something was happening, but couldn't see anything. So I tried again and this time, it worked.</p>
<p>It spun up easy enough and with minor changes to the PersistentVolumeClaim, it just worked as well, albeit it a bit slower than GKE, which was odd because I had double the resources on Azure.</p>
<h2 id="sonowwhat">So, now what?</h2>
<p>Alright, so now I seem to be on the kubernetes train. Even writing it now, it seems kinda crazy to spin up a kubernetes cluster to run a blog that is probably only going to have me as traffic. But it is expandable. There are a couple of sites I want to host. They're currently in containers on Azure Web apps, but should move across easy enough.</p>
<p>I'm still not sure of cost. I will run both solutions for a couple of days and have a look at what charges come through. I hadn't planned to move from Azure at this time. That's where I have the most experience.</p>
<h2 id="nextsteps">Next steps</h2>
<ol>
<li>Run some performance and pricing measures to compare GKE vs AKS and decide where my blog will stay.</li>
<li>Write up the technical steps for creating the blog.</li>
<li>Enable the site to run <a href="https://www.troyhunt.com/the-6-step-happy-path-to-https/">HTTPS</a> with <a href="https://letsencrypt.org">Let's Encrypt</a> certificates.</li>
</ol>
