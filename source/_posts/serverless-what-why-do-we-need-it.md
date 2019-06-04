---
title: Serverless what? Why do we need it?
date: 2019-05-20 08:58:24
tags:
cover_img: /serverless-what-why-do-we-need-it/small_madhu-shesharam-669293-unsplash.jpg
feature_img: madhu-shesharam-669293-unsplash.jpg
description:
keywords:
---
"Serverless" was one of those terms that left me scratching my head when I first heard it. How on earth do you run a server... without a server??? That's some crazy marketing spin! What I quickly learned is that serverless is referring to how much infrastructure you need to manage. That is, none. Nada.

So who cares? I mean, I'm running on PaaS. I can change the number of servers with a slider, or set rules to automatically add and remove servers as my traffic changes. Isn't that good enough? Not according to [Troy Hunt](https://www.troyhunt.com/serverless-to-the-max-doing-big-things-for-small-dollars-with-cloudflare-workers-and-azure-functions/). When your traffic spikes (like, when your site is on the news and a million people pick up their phone at the same time and hit your site), you can go from "too much cloud" to "not enough cloud" very quickly. It's in this environment of rapidly changing traffic (and realistically, that's when it counts), that serverless really shines.

# So what is it?
Alright, so what IS serverless? Let's consider what you might be using now. You've got a few VMs on a scale set, or you've got a few VMs as nodes of a Kubernetes cluster, or maybe you have some PaaS offering where you pick the number of machines backing it. You've got some rules in place to scale up as traffic increases and then back down to reduce costs when it falls again. Each of these scenarios have:
* a fixed monthly costs per backing VM
* a maximum traffic threshold
* increasing latency as the traffic approaches the threshold
* rules to increase and decrease the number of backing VMs to trade off running cost vs latency

Let's say you increase your VMs by 10x or 100x. Assuming your architecture can scale, your latency issues have just vanished. Your servers are idling with unlimited resources compared to the current load. HOWEVER, your running costs have also increased by 10x or 100x. But the servers are just idling. So, what if you only paid for the activity you caused? That fraction of a ms of CPU. That couple of KB of RAM as you process an incoming request. Assuming the price is right, wouldn't that be better? Assuming the costs are around VM rate * Utilisation, you're instantly ahead! No more scaling of resources. Costs are directly related to resources used. Oh, and one final thing. The available resources is now a DATACENTER worth of resources. Your armageddon-style traffic spike is barely a blip on their radar.

That is Serverless.

# How do I use it?
Unfortunately, serverless doesn't necessarily come for free. Architecturally, you don't run your server any more. And I mean software server, not the VM. Instead, you need to present a function based API (eg. Azure Functions or AWS Lambda) and that is effectively injected into the provider's service to execute  as configured. If you have followed a [Clean Code Architecture](https://youtu.be/_lwCVE_XgqI?list=PL7soaAB-BQAbAFa1XZkg7wOvDHorQ7KiO), it's probably simple to extract your application logic into a Functions application. If you've got application code in your controllers, or using Filters, etc, well, that will take more.

Some services are Serverless already and some are not. If you want to build serverless, you're looking at:
* Storage
* Azure Functions
* Service Bus
* SignalR service
* AKS (with virtual kubelet)

If you want to bring your serverless architecture to its knees, try:
* SQL Server (for now - [serverless is coming](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-serverless))
* Web apps

I've had a hard time putting AKS in either bucket at the moment. It runs on specific nodes (so not serverless), but there's also a virtual Kubelet that lets you use ACI as a serverless overflow. Personally, I prefer the Azure Function pricing model over the ACI pricing model and the cost of spinning up a function is MUCH lower than spinning up a container, however it might keep up if your site had a massive traffic spike. Probably somewhere between "pure" serverless and PaaS, but this is just a guess. So, it may be possible to use containers, AKS and Virtual Kubelet to take you some of the way towards stability within rapid traffic spikes, depending on your service startup time.

# Final words
Serverless brings an extraordinary level of burst tolerance to your application, which will bring resilience and performance under extreme loads. As with any architectural decision, it's not all or nothing. You can have parts of a system that are serverless, with other parts not, such as a Web App that sends messages to a Service Bus. With a serverless backing, the web app will likely provide greater resilience under load. Use load testing to measure where your bottlenecks are. Importantly, look for any part of your architecture where serverless is hitting resource bound components. Make sure you have a fallback strategy for when the resource bound component is at maximum load.

Serverless is actually not a new idea and there are many serverless services available. Please refer to the [Azure Serverless services](https://azure.microsoft.com/en-us/solutions/serverless/) for more info. Effective use of serverless components in your architecture will massively increase the scalability of your application.
